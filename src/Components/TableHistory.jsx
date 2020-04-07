import React, { useEffect } from "react";
import ReactTable from "react-table-6/react-table.min";
import { useSelector } from "react-redux";
import { getDaysLeft } from "../App";
import Spinner from "./Spinner";

// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}

const TableHistory = props => {
  // console.log(props.activityData);
  // console.log(props.loadingActivities);
  const data =  useSelector(state => state.activitiesStore.data);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);
  // useEffect(() => {
  //   props.fetchActivities();
  // }, []);
  // const parsedData = props.activityData.filter(obj => obj.code === props.code);

  return loadingActivities ? (
    <>
      <Spinner />
    </>
  ) : (
    <div className="tableHistory">
      <ReactTable
        className="table font_white_shadow -striped -highlight"
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
            Header: "Тип",
            accessor: "type",
            headerClassName: "tableHeader",
            style: { whiteSpace: "unset" },
            width: widthForTable(20)
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
