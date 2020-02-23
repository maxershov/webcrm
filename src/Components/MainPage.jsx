import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

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
  const personData = useSelector(state => state.personsStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const dayData = useSelector(state => state.dayStore.data);
  const loadingDays = useSelector(state => state.dayStore.loading);


  const dispatch = useDispatch()


  const history = useHistory();
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  const indexDate = dayData.findIndex(x => x.date === loadedDate);
  const data = dayData[indexDate];

  useEffect(() => {
    dispatch(fetchPersons());
    dispatch(fetchDays());
  }, []);

  const changeLoadDate = date => {
    const formatedDate = format(date, "dd-MM-yyyy");

    setLoadedDate(formatedDate);
  };


  return (!loadingDays && !loadingPersons) ? (
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
      <TableForScanner data={dayData[indexDate]} />
    </>
  ) : <Spinner />
};


export default MainPage;
