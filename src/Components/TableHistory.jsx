import React from "react";
import ReactTable from "react-table-6/react-table.min";
import { useSelector, useDispatch } from "react-redux";
import { deleteHistoryObj } from '../store/activitiesDataStore/activitiesDataActions';
import { getDaysLeft } from "../App";
import Spinner from "./Spinner";


// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}


const TableHistory = props => {
  const data = useSelector(state => state.activitiesStore.data);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);
  const dispatch = useDispatch();


  function deleteHistory(obj) {
    dispatch(deleteHistoryObj(obj.code, obj.date, obj.time, obj.type, obj.person, obj.amount));
  }


  return loadingActivities ? (<Spinner />) :
    (
      <div className="tableHistory">
        <ReactTable
          className="table -striped -highlight"
          previousText="Назад"
          nextText="Вперед"
          loadingText="Загрузка"
          noDataText="Нет данных"
          pageText="Страница"
          ofText="из"
          rowsText="профилей"
          data={data}
          columns={[
            {
              Header: '',
              width: widthForTable(4),
              headerClassName: 'tableHeader',
              Cell: (value) => (
                <button id="DeleteButton" type="button" onClick={() => deleteHistory(value.original)}>X</button>)
            },
            {
              Header: "Тип",
              accessor: "type",
              headerClassName: "tableHeader",
              style: { whiteSpace: "unset" },
              width: widthForTable(16)
            },
            {
              Header: "Дата",
              accessor: "date",
              width: widthForTable(10),
              headerClassName: "tableHeader",
              sortMethod: (a, b) => {
                const dayA = getDaysLeft(a);
                const dayB = getDaysLeft(b);
                return (
                  (dayA === "") - (dayB === "") ||
                  +(dayA > dayB) ||
                  -(dayA < dayB)
                );
              }
            },
            {
              Header: "Время",
              width: widthForTable(10),
              accessor: "time",
              headerClassName: "tableHeader"
            },
            {
              Header: "Имя",
              accessor: "person",
              style: { whiteSpace: "unset" },
              width: widthForTable(20),
              headerClassName: "tableHeader"
            },
            {
              Header: "Значение",
              accessor: "amount",
              width: widthForTable(40),
              headerClassName: "tableHeader",
              style: { whiteSpace: "unset" }
            }
          ]}
          defaultSorted={[{ id: "date", desc: true }]}
          defaultPageSize={10}
        />
      </div>
    );
};


export default TableHistory;
