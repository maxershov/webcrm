import React, {useEffect, useState} from "react";
import ReactTable from "react-table-6/react-table.min";
import { useSelector, useDispatch } from "react-redux";
import { deleteHistoryObj } from '../store/activitiesDataStore/activitiesDataActions';
import { getDaysLeft } from "../App";


// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}


const TableHistory = props => {
  const data = useSelector(state => state.activitiesStore.data);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);
  const dispatch = useDispatch();
  const [widthCoeff, setWidthCoeff] = useState(window.innerWidth/100); 


  function deleteHistory(obj) {
    dispatch(deleteHistoryObj(obj.code, obj.date, obj.time, obj.type, obj.person, obj.amount));
  }

  function handleResize() {
    setWidthCoeff(window.innerWidth/100);
  }


  useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  return loadingActivities ? <span className="spinner" /> :
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
              width: widthCoeff * 4,
              headerClassName: 'tableHeader',
              Cell: (value) => (
                <button id="DeleteButton" type="button" onClick={() => deleteHistory(value.original)}>X</button>)
            },
            {
              Header: "Тип",
              width: widthCoeff* 16,
              accessor: "type",
              headerClassName: "tableHeader",
              style: { whiteSpace: "unset" }
            },
            {
              Header: "Дата",
              accessor: "date",
              width: widthCoeff * 10,
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
              width: widthCoeff * 10,
              accessor: "time",
              headerClassName: "tableHeader"
            },
            {
              Header: "Имя",
              accessor: "person",
              style: { whiteSpace: "unset" },
              width: widthCoeff * 20,
              headerClassName: "tableHeader"
            },
            {
              Header: "Значение",
              accessor: "amount",
              width: widthCoeff *40,
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
