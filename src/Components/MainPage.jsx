import React, { useState, useEffect } from "preact/compat";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { format, parse } from "date-fns";
import Calendar from 'react-calendar';

import AreaNotes from "./AreaNotes";
import CodeScanner from "./CodeScanner";
import ProfileCreator from "./ProfileCreator";
import TableForScanner from './TableForScanner';
import { isToday } from "../App";

import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import { fetchDays } from "../store/dayDataStore/dayDataActions";
import { fetchVisits } from "../store/activitiesDataStore/activitiesDataActions";


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

  document.title = `${loadedDate} CRM`;

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
          className="calendar calendar--main"
          value={parse(loadedDate, "dd-MM-yyyy", new Date())}
          onChange={date => changeLoadDate(date)}
        />
        <div className="mainPage-notes">
          <AreaNotes type="DAY_DATA" notesValue={notesValue} date={loadedDate} />
        </div>
        {isToday(loadedDate) ? (
          <>
            <CodeScanner />
            <ProfileCreator route={history} />
          </>
        ) : (
            undefined
          )}
      </div>
      <TableForScanner />
      <div className="footer">
        <a href="https://twitter.com/MaksksE" className="footer__link">Max Ershov<br />2020</a>
      </div>
    </>
  ) : <span className="spinner" />
};


export default MainPage;