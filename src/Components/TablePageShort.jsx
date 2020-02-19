/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
import React from 'react';
import ReactTable from 'react-table-6/react-table.min';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from "react-router-dom";
import { getDaysLeft } from '../App';
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import Spinner from './Spinner'

// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100))
}


const TablePageShort = (props) => {
  const { pageNum } = useParams();
  const history = useHistory();
  // TODO CRAP => can't change page in path => get path from history and del number 
  const path = history.location.pathname.replace(/[0-9]/g, '');

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

  let tableRow = {};
  if (props.tableType === 'ЛИД') tableRow = leadObj;
  if (props.tableType === 'СОТРУДНИК') tableRow = employeeObj;
  if (props.tableType === 'НЕТ') tableRow = lostObj;

  return props.loadingPersons ? (<><Spinner /></>) : (
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
        data={props.personData.filter(obj => obj.contract === props.tableType)}
        filterable
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value}
        columns={[
          {
            Header: 'Фото',
            width: widthForTable(25),
            headerClassName: 'tableHeader',
            Cell: (value) => (
              <button type="button" onClick={() => history.push(`/profile/${value.original.code}`)}><img id="tablePhoto" alt="tablePhoto" src={require(`../images/0.jpg`)} /></button>)
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


const mapStateToProps = state => {
  return {
    personData: state.personsStore.data,
    loadingPersons: state.personsStore.loading,
  }
}

const mapDispatchToProps = dispatch => ({
  fetchPersons: () => dispatch(fetchPersons())
});

export default connect(mapStateToProps, mapDispatchToProps)(TablePageShort);