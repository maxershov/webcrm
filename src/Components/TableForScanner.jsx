import React, { useEffect, useState } from 'react';
import ReactTable from "react-table-6/react-table.min";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Spinner from './Spinner';
import { getIndexByCode } from "../App";


import { getDateObj } from "../App";



// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}

// function getPhotoId(code) {
//     return personData[getIndexByCode(code)].photoId;
//   }


const TableForScanner = (props) => {

  const history = useHistory();

  const index = props.dayData.findIndex(x => x.date === props.date);

  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    setHistoryData(props.data.history);
  }, [props.data]);

  return props.loadingDays ? (<><Spinner /></>) : (
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
                  id="tablePhoto"
                  alt="tablePhoto"
                  height={80}
                  src={require(`../images/0.jpg`)}
                />
              </button>
            )
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
  )
}


const mapStateToProps = state => {
  return {
    dayData: state.dayStore.data,
    loadingDays: state.dayStore.loading,
  };
};

export default connect(mapStateToProps)(TableForScanner);