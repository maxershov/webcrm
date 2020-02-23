import React, { useEffect, useState } from 'react';
import ReactTable from "react-table-6/react-table.min";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Spinner from './Spinner';
import { getIndexByCode , getDateObj } from "../App";






// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}

// function getPhotoId(code) {
//     return personData[getIndexByCode(code)].photoId;
//   }


const TableForScanner = (props) => {

  const personData = useSelector(state => state.personsStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const loadingDays = useSelector(state => state.dayStore.loading);

  const history = useHistory();


  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    setHistoryData(props.data.history);
  }, [props.data]);

  return (!loadingDays && !loadingPersons) ? (
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
                  src={require(`../images/0.jpg`)}
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
            Cell: ({value}) => (<Link to={`/profile/${value}`}>{personData[getIndexByCode(value)].personName}</Link>)
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
  ) :  <Spinner />
}


export default TableForScanner;