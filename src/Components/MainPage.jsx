import React, { useState, useEffect } from "preact/compat";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { format, parse } from "date-fns";
import Calendar from 'react-calendar';
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import { fetchDays } from "../store/dayDataStore/dayDataActions";
import { fetchVisits } from "../store/activitiesDataStore/activitiesDataActions";
import AreaNotes from "./AreaNotes";
import CodeScanner from "./CodeScanner";
import { isToday } from "../App";
import TableForScanner from './TableForScanner';


export const MainPage = props => {
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const loadingDays = useSelector(state => state.dayStore.loading);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);
  const notesValue = useSelector(state => state.dayStore.data.notes);
  const dispatch = useDispatch();


  const history = useHistory();
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );

  document.title = `${loadedDate } CRM`;

  useEffect(() => {
    dispatch(fetchVisits(loadedDate));
    dispatch(fetchPersons());
    dispatch(fetchDays(loadedDate));
  }, [dispatch, loadedDate]);


  const changeLoadDate = date => {
    setLoadedDate(format(date, "dd-MM-yyyy"))
    dispatch(fetchDays(loadedDate));
    dispatch(fetchVisits(loadedDate));
  };

  return (!loadingDays && !loadingPersons && !loadingActivities) ? (
    <>
      <div className="mainPage">
        <Calendar
          className="calendar calendarMain"
          value={parse(loadedDate, "dd-MM-yyyy", new Date())}
          onChange={date => changeLoadDate(date)}
        />
        <div className="notesMain">
          <AreaNotes type="DAY_DATA" notesValue={notesValue} date={loadedDate} />
        </div>
        {isToday(loadedDate) ? (
          <>
            <CodeScanner divName="newProfileField" route={history} type="PROFILE" />
            <CodeScanner divName="newCodeField" type="SCANNER" />
          </>
        ) : (
            undefined
          )}
      </div>
      <TableForScanner />
      <div className="author">
        <a href="https://twitter.com/MaksksE" className="authorLink">Max Ershov<br />2020</a>
      </div>
    </>
  ) : <span className="spinner" />
};


export default MainPage;