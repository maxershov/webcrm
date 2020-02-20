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
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  const data = getDateObj(loadedDate);

  useEffect(() => {
    props.fetchPersons();
    props.fetchDays();
    // console.log('useEffecDone');
  }, []);

  const changeLoadDate = date => {
    const formatedDate = format(date, "dd-MM-yyyy");
    // async chg redux state 
    props.addNewData(formatedDate);

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
      <TableForScanner date={loadedDate} />
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
  addNewData: (dateTo) => dispatch(changeDay(dateTo))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
