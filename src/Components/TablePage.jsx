/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import ReactTable from 'react-table-6/react-table.min';
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { getDaysLeft } from '../App';
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import host from "../../host";
import phoneSvg from "../assets/phone.svg"

const TablePage = (props) => {
  const history = useHistory();
  const { pageNum } = useParams();
  const personData = useSelector(state => state.personsStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const dispatch = useDispatch();

  // add state for table to rerender
  const [widthCoeff, setWidthCoeff] = useState(window.innerWidth / 100);


  function handleResize() {
    setWidthCoeff(window.innerWidth / 100);
  }

  useEffect(() => {
    dispatch(fetchPersons());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return loadingPersons ? <span className="spinner" /> : (
    <>
      <img className="askPhoneTurn" alt="turn to landscape" src={phoneSvg} />
      <ReactTable
        className="table -striped -highlight portrait-hide"
        page={parseInt(pageNum, 10) - 1}
        onPageChange={(pageIndex) => { history.push(`/clients/page/${pageIndex + 1}`) }}
        previousText="Назад"
        nextText="Вперед"
        loadingText="Загрузка"
        noDataText="Нет данных"
        pageText="Страница"
        ofText="из"
        rowsText="профилей"
        headerClassName="tableHeader"
        data={props.all ? personData :
          personData.filter(obj => obj.contract !== 'СОТРУДНИК' && obj.contract !== 'НЕТ' && obj.contract !== 'ЛИД')}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        columns={[
          {
            Header: 'Фото',
            width: widthCoeff * 15,
            headerClassName: 'tableHeader',
            Cell: (value) => (
              <input type="image" id="tablePhoto" onClick={() => history.push(`/profile/${value.original.code}`)} alt="Profile image" src={`http://${host}:6700/images/${value.original.photoId ?? "0.jpg"}`} />)
          },
          {
            Header: 'Имя',
            id: 'rowCode',
            width: widthCoeff * 20,
            style: { whiteSpace: 'unset' },
            headerClassName: 'tableHeader',
            accessor: 'personName',
            filterMethod: (filter, row) => {
              const name = row._original.personName;
              const { code } = row._original;
              if (name.toLowerCase().startsWith(filter.value.toLowerCase())) return true; // sort by second name
              if (code.toLowerCase().startsWith(filter.value.toLowerCase())) return true; // sort by code
              if (name.includes(" ")) { // sort by first name
                if (name.toLowerCase().split(' ')[1].startsWith(filter.value.toLowerCase())) return true;
              } return false;
            },
            Cell: row => (<Link to={`/profile/${row.original.code}`}>{row.original.personName}</Link>)
          }
          , {
            Header: 'Контракт',
            accessor: 'contract',
            style: { whiteSpace: 'unset' },
            headerClassName: 'tableHeader',
            width: widthCoeff * 17.5,
            filterMethod: (filter, row) => {
              if (row[filter.id].toLowerCase().startsWith(filter.value.toLowerCase())) return true;// sort by second word
              if (row[filter.id].includes(" ")) { // sort by first word
                if (row[filter.id].toLowerCase().split(' ')[1].startsWith(filter.value.toLowerCase())) return true;
              } return false;
            },
          }, {
            Header: 'Остаток дней',
            width: widthCoeff * 9,
            accessor: 'days',
            headerClassName: 'tableHeader',
            sortMethod: (a, b) => {
              const dayA = getDaysLeft(a);
              const dayB = getDaysLeft(b);
              return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
            },
            Cell: ({ value }) => (getDaysLeft(value))
          }, {
            Header: 'Посещений',
            width: widthCoeff * 9,
            accessor: 'remain',
            headerClassName: 'tableHeader',
          }, {
            Header: 'Аренда дней',
            width: widthCoeff * 9,
            accessor: 'rent',
            headerClassName: 'tableHeader',
            sortMethod: (a, b) => {
              const dayA = getDaysLeft(a);
              const dayB = getDaysLeft(b);
              return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
            },
            Cell: ({ value }) => (getDaysLeft(value)),
          }, {
            Header: 'Депозит',
            width: widthCoeff * 11.5,
            accessor: 'deposite',
            headerClassName: 'tableHeader'
          }, {
            Header: 'Парковка',
            width: widthCoeff * 9,
            accessor: 'autoMonth',
            headerClassName: 'tableHeader'
          }
        ]}
        defaultSorted={[{ id: 'personName', desc: false }]}
        defaultPageSize={20}
      />
    </>
  )
}


export default TablePage;