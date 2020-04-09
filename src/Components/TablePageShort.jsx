/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import ReactTable from 'react-table-6/react-table.min';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useParams } from "react-router-dom";
import { getDaysLeft } from '../App';
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import Spinner from './Spinner'
import host from "../../host";


// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100))
}


const TablePageShort = (props) => {
  const { pageNum } = useParams();
  const history = useHistory();
  const path = history.location.pathname.replace(/[0-9]/g, '');

  const personData = useSelector(state => state.personsStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPersons());
  }, []);

  // some obj's for table => don't repeat photo and name column 
  const leadObj = {
    Header: 'Дата первого контакта',
    accessor: 'rent',
    width: widthForTable(25),
    headerClassName: 'tableHeader',
    sortMethod: (a, b) => {
      const dayA = getDaysLeft(a);
      const dayB = getDaysLeft(b);
      return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
    }
  }

  const employeeObj = {
    Header: 'Депозит',
    width: widthForTable(25),
    accessor: 'deposite',
    headerClassName: 'tableHeader'
  }

  const lostObj = {
    Header: 'Срок действия последнего абонемента',
    accessor: 'days',
    width: widthForTable(25),
    headerClassName: 'tableHeader',
    sortMethod: (a, b) => {
      const dayA = getDaysLeft(a);
      const dayB = getDaysLeft(b);
      return (dayA === "") - (dayB === "") || +(dayA > dayB) || -(dayA < dayB);
    }
  }

  // use different types of columns for lead, employee and lost table 
  let tableRow = {};
  if (props.tableType === 'ЛИД') tableRow = leadObj;
  if (props.tableType === 'СОТРУДНИК') tableRow = employeeObj;
  if (props.tableType === 'НЕТ') tableRow = lostObj;

  return loadingPersons ? (<><Spinner /></>) : (
    <div className="table font_white_shadow">
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
            width: widthForTable(15),
            headerClassName: 'tableHeader',
            Cell: (value) => (
              <button id="tablePhotoButton" type="button" onClick={() => history.push(`/profile/${value.original.code}`)}><img id="tablePhoto" alt="tablePhoto" src={`http://${host}:6700/images/${value.original.photoId ?? "0.jpg"}`} /></button>)
          },
          {
            Header: 'Имя',
            id: 'rowCode',
            width: widthForTable(50),
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
          },
          tableRow
        ]}
        defaultSorted={[{ id: 'personName', desc: false }]}
        defaultPageSize={20}
      />
    </div>
  )
}



export default TablePageShort;