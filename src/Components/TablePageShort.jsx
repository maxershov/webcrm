/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'preact/compat';
import ReactTable from 'react-table-6/react-table.min';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from "react-router-dom";
import { getDaysLeft } from '../App';
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import phoneSvg from "../assets/phone.svg"


const TablePageShort = (props) => {
  const { pageNum } = useParams();
  const history = useHistory();
  const path = history.location.pathname.replace(/[0-9]/g, '');

  const personData = useSelector(state => state.personsStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const dispatch = useDispatch();
  const [widthCoeff, setWidthCoeff] = useState(window.innerWidth / 100);


  useEffect(() => {
    dispatch(fetchPersons());
  }, []);


  function handleResize() {
    setWidthCoeff(window.innerWidth / 100);
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // some object's for table => don't repeat photo and name column 
  const leadObj = {
    Header: 'Дата первого контакта',
    accessor: 'rent',
    width: widthCoeff * 25,
    headerClassName: 'table__header',
    sortMethod: (a, b) => {
      const dayA = getDaysLeft(a);
      const dayB = getDaysLeft(b);
      return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
    },
    Cell: row => (<Link to={`/profile/${row.original.code}`}>{row.original.rent}</Link>)
  }

  const employeeObj = {
    Header: 'Депозит',
    width: widthCoeff * 25,
    accessor: 'deposite',
    headerClassName: 'table__header',
    Cell: row => (<Link to={`/profile/${row.original.code}`}>{row.original.deposite}</Link>)
  }

  const lostObj = {
    Header: 'Срок действия последнего абонемента',
    accessor: 'days',
    width: widthCoeff * 25,
    headerClassName: 'table__header',
    sortMethod: (a, b) => {
      const dayA = getDaysLeft(a);
      const dayB = getDaysLeft(b);
      return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
    },
    Cell: row => (<Link to={`/profile/${row.original.code}`}>{row.original.days}</Link>)
  }


  // use different types of columns for lead, employee and lost table 
  let tableRow = {};
  if (props.tableType === 'ЛИД') {
    document.title = "Лид CRM";
    tableRow = leadObj;
  }
  if (props.tableType === 'СОТРУДНИК') {
    document.title = "Сотрудники CRM";
    tableRow = employeeObj;
  }
  if (props.tableType === 'НЕТ') {
    document.title = "Прошлые CRM";
    tableRow = lostObj;
  }


  return loadingPersons ? <span className="spinner" /> : (
    <>
      <img className="warning-to-landscape" alt="turn to landscape" src={phoneSvg} />
      <div className="table portrait-hide">
        <ReactTable
          className="-striped -highlight"
          page={parseInt(pageNum, 10) - 1}
          onPageChange={(pageIndex) => { history.push(path + (pageIndex + 1)) }}
          previousText="Назад"
          nextText="Вперед"
          loadingText="Загрузка"
          noDataText="Нет данных"
          pageText="Страница"
          ofText="из"
          rowsText="профилей"
          data={personData.filter(obj => obj.contract === props.tableType)}
          filterable
          defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
          columns={[
            {
              Header: 'Фото',
              width: widthCoeff * 15,
              headerClassName: 'table__header',
              Cell: (value) => (
                <input className="person-img" type="image" onClick={() => history.push(`/profile/${value.original.code}`)} alt="Profile image" src={`/images/${value.original.photoId ?? "0.jpg"}`} />)
            },
            {
              Header: 'Имя',
              id: 'rowCode',
              width: widthCoeff * 50,
              style: { whiteSpace: 'unset' },
              headerClassName: 'table__header',
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
            },
            tableRow
          ]}
          defaultSorted={[{ id: 'personName', desc: false }]}
          defaultPageSize={20}
        />
      </div>
    </>
  )
}



export default TablePageShort;