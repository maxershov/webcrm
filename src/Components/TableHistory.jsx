import { h } from "preact";
import { useEffect, useState } from "preact/compat";
import ReactTable from "react-table-6/react-table.min";
import { useSelector, useDispatch } from "react-redux";
import { deleteHistoryObj } from '../store/activitiesDataStore/activitiesDataActions';
import { getDaysLeft } from "../App";


const TableHistory = () => {
  const data = useSelector(state => state.activitiesStore.data);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);
  const dispatch = useDispatch();
  const [widthCoeff, setWidthCoeff] = useState(window.innerWidth / 100);


  function deleteHistory(obj) {
    dispatch(deleteHistoryObj(obj.code, obj.date, obj.time, obj.type, obj.person, obj.amount));
  }

  function handleResize() {
    setWidthCoeff(window.innerWidth - 5 / 100);
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
              width: widthCoeff * 4,
              headerClassName: 'table__header',
              Cell: (value) => (
                <button className="button table__delete-btn" type="button" onClick={() => deleteHistory(value.original)}>X</button>)
            },
            {
              Header: "Тип",
              width: widthCoeff * 16,
              accessor: "type",
              headerClassName: "table__header",
              style: { whiteSpace: "unset" }
            },
            {
              Header: "Дата",
              accessor: "date",
              width: widthCoeff * 10,
              headerClassName: "table__header",
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
              headerClassName: "table__header"
            },
            {
              Header: "Имя",
              accessor: "person",
              style: { whiteSpace: "unset" },
              width: widthCoeff * 20,
              headerClassName: "table__header"
            },
            {
              Header: "Значение",
              accessor: "amount",
              width: widthCoeff * 40,
              headerClassName: "table__header",
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
