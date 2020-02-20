import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { format, parse } from "date-fns";
import Calendar from "react-calendar/dist/entry.nostyle";
import AreaNotes from "./AreaNotes";
import CodeScanner from "./CodeScanner";
import FormData from "./FormData";
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import { fetchDays, changeDay } from "../store/dayDataStore/dayDataActions";
import { getDateObj } from "../App";


import TableForScanner from './TableForScanner';
import Spinner from './Spinner';


function isToday(date) {
  const todayDate = format(new Date(), "dd-MM-yyyy");
  return todayDate === date;
}



export const MainPage = props => {
  const history = useHistory();
  const [countState, setCountState] = useState(0);
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  const indexDate = props.dayData.findIndex(x => x.date === loadedDate);
  const data = props.dayData[indexDate];

  useEffect(() => {
    props.fetchPersons();
    props.fetchDays();
  }, []);

  const changeLoadDate = date => {
    const formatedDate = format(date, "dd-MM-yyyy");

    setLoadedDate(formatedDate);
  };


  return (!props.loadingDays && !props.loadingPersons) ? (
    <>
      <div className="mainPage">
        <Calendar
          className="calendar calendarMain"
          value={parse(loadedDate, "dd-MM-yyyy", new Date())}
          onChange={date => changeLoadDate(date)}
        />
        <div className="notesMain font-white-shadow">
          <AreaNotes notesValue={data?.notes} type="DAY_DATA" dayObject={data} />
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
      <TableForScanner count={data.history.length} date={loadedDate} data={props.dayData[indexDate]} />
    </>
  ) : (<><Spinner /></>)
};

const mapStateToProps = state => {
  return {
    personData: state.personsStore.data,
    loadingPersons: state.personsStore.loading,
    dayData: state.dayStore.data,
    loadingDays: state.dayStore.loading,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchPersons: () => dispatch(fetchPersons()),
  fetchDays: () => dispatch(fetchDays()),
  addNewData: (dayObj) => dispatch(changeDay(dayObj))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
