import React, { useEffect } from "react";
import ReactTable from "react-table-6/react-table.min";
import { connect } from "react-redux";
import { getDaysLeft } from "../App";
import Spinner from "./Spinner";
import { fetchActivities } from "../store/activitiesDataStore/activitiesDataActions";

// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}

const TableHistory = props => {
  console.log(props.activityData);
  console.log(props.loadingActivities);

  useEffect(() => {
    props.fetchActivities();
  }, []);
  const parsedData = props.activityData.filter(obj => obj.code === props.code);

  return props.loadingActivities ? (
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
        data={parsedData[0]?.activity}
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

const mapStateToProps = state => {
  return {
    activityData: state.activitiesStore.data,
    loadingActivities: state.activitiesStore.loading
  };
};

const mapDispatchToProps = dispatch => ({
  fetchActivities: () => dispatch(fetchActivities())
});

export default connect(mapStateToProps, mapDispatchToProps)(TableHistory);
