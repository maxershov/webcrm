import React from 'react';
import ReactTable from "react-table-6/react-table.min";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getIndexByCode } from "../App";
import host from "../../host";


// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}


const TableForScanner = (props) => {

  const personData = useSelector(state => state.personsStore.data);
  const historyData = useSelector(state => state.activitiesStore.data);
  const history = useHistory();

  return (
    <div className="tableMain">
      <ReactTable
        className="table -striped -highlight"
        previousText="Назад"
        nextText="Вперед"
        loadingText="Загрузка"
        noDataText="Нет данных"
        pageText="Страница"
        ofText="из"
        rowsText="профилей"
        data={historyData}
        columns={[
          {
            Header: "Фото",
            width: widthForTable(20),
            accessor: "code",
            headerClassName: "tableHeader",
            Cell: ({ value }) => (
              <button
                type="button"
                onClick={() => history.push(`/profile/${value}`)}
              >
                <img
                  alt="tablePhoto"
                  height={80}
                  src={`http://${host.host}:6700/images/${personData[getIndexByCode(value)]?.photoId ?? "0.jpg"}`}
                />
              </button>
            )
          },
          {
            Header: 'Имя',
            accessor: 'code',
            width: widthForTable(60),
            headerClassName: 'tableHeader',
            style: { whiteSpace: 'unset' },
            Cell: ({ value }) => (<Link to={`/profile/${value}`}>{personData[getIndexByCode(value)]?.personName ?? value}</Link>)
          },
          {
            Header: "Время",
            width: widthForTable(20),
            accessor: "time",
            headerClassName: "tableHeader"
          }
        ]}
        defaultSorted={[
          {
            id: "time",
            desc: true
          }
        ]}
        defaultPageSize={5}
      />
    </div>
  );
}


export default TableForScanner;