import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { format, parse } from "date-fns";
import ReactTable from "react-table-6/react-table.min";
import Calendar from "react-calendar/dist/entry.nostyle";
import AreaNotes from "./AreaNotes";
import CodeScanner from "./CodeScanner";
import FormData from "./FormData";
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import { fetchDays } from "../store/dayDataStore/dayDataActions";
import { getIndexByCode, getDateObj } from "../App";

import Spinner from './Spinner';

// set width to table colums by .className size
function widthForTable(value) {
  return Math.round(window.innerWidth * (value / 100));
}

function isToday(date) {
  const todayDate = format(new Date(), "dd-MM-yyyy");
  return todayDate === date;
}



export const MainPage = props => {
  const history = useHistory();
  const personData = JSON.parse(props.personData);
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  const data = JSON.parse(getDateObj(loadedDate));

  useEffect(() => {
    console.log('useEffectTriggered');
    props.fetchPersons();
    props.fetchDays();
    console.log('useEffecDone');
  }, []);

  const changeLoadDate = date => {
    const formatedDate = format(date, "dd-MM-yyyy");
    setLoadedDate(formatedDate);
  };

  function getPhotoId(code) {
    return personData[getIndexByCode(code)].photoId;
  }

  return props.loadingDays || props.loadingPersons ? (<><Spinner /></>) : (
    <>
      <div className="mainPage">
        <Calendar
          className="calendar calendarMain"
          value={parse(loadedDate, "dd-MM-yyyy", new Date())}
          onChange={date => changeLoadDate(date)}
        />
        <button
          type="button"
          onClick={() => {
            props.fetchDays();
          }}
        >
          FETCH DAY
        </button>
        {props.loadingDays ? (
          <p>LOADING</p>
        ) : (
            <p>{JSON.stringify(props.testDataDays)}</p>
          )}
        <button
          type="button"
          onClick={() => { props.fetchPersons(); }}
        >
          FETCHH
        </button>
        {props.loadingPersons ? (
          <p>LOADING</p>
        ) : (
            <p>{JSON.stringify(props.testData)}</p>
          )}

        <div className="notesMain font-white-shadow">
          <AreaNotes notesValue={data.notes} type="DAY_DATA" dayObject={data} />
        </div>
        <div className="newProfileField">
          <FormData
            baseValue=""
            formLabel="Новый профиль:"
            type="NEW_PERSON"
            route={history}
          />
        </div>
        {isToday(loadedDate) ? (
          <div className="newCodeField">
            <CodeScanner dayObject={data} date={loadedDate} />
          </div>
        ) : (
            undefined
          )}
      </div>
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
          data={data.history}
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
                    src={require(`../images/${getPhotoId(value)}.jpg`)}
                  />
                </button>
              )
            },
            {
              Header: "Имя",
              accessor: "code",
              width: widthForTable(60),
              headerClassName: "tableHeader",
              style: { whiteSpace: "unset" },
              Cell: ({ value }) => (
                <Link to={`/profile/${value}`}>
                  {personData[getIndexByCode(value)].personName}
                </Link>
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
    </>
  )
};

const mapStateToProps = state => {
  return {
    personData: state.personStore.data,
    dayData: state.dayDataStore.data,
    testData: state.testDataStore.data,
    loadingPersons: state.testDataStore.loading,
    loadingDays: state.testDataDayStore.loading,
    testDataDays: state.testDataDayStore.data
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPersons: () => dispatch(fetchPersons()),
  fetchDays: () => dispatch(fetchDays())
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
