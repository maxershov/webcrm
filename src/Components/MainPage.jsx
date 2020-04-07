import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";

import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import { format, parse } from "date-fns";
import Calendar from "react-calendar/dist/entry.nostyle";
import AreaNotes from "./AreaNotes";
import CodeScanner from "./CodeScanner";
import InputNewProfile from "./InputNewProfile";
import { fetchPersons } from "../store/personsDataStore/personsDataActions";
import { fetchDays } from "../store/dayDataStore/dayDataActions";
import { fetchProfile } from "../store/profileStore/profileActions";
import { fetchVisits, fetchHistory } from "../store/activitiesDataStore/activitiesDataActions";
import { getDateObj } from "../App";


import TableForScanner from './TableForScanner';
import Spinner from './Spinner';


function isToday(date) {
  const todayDate = format(new Date(), "dd-MM-yyyy");
  return todayDate === date;
}



export const MainPage = props => {
  const personData = useSelector(state => state.personsStore.data);
  const dayData = useSelector(state => state.dayStore.data);
  const loadingPersons = useSelector(state => state.personsStore.loading);
  const loadingDays = useSelector(state => state.dayStore.loading);
  const loadingActivities = useSelector(state => state.activitiesStore.loading);


  const dispatch = useDispatch();


  const history = useHistory();
  const [loadedDate, setLoadedDate] = useState(
    format(new Date(), "dd-MM-yyyy")
  );
  // const indexDate = dayData.findIndex(x => x.date === loadedDate);
  // const data = dayData[indexDate];

  useEffect(() => {
    dispatch(fetchVisits(loadedDate));
    dispatch(fetchPersons());
    dispatch(fetchDays(loadedDate));
  }, [dispatch, loadedDate]);

  const changeLoadDate = date => {
    setLoadedDate(format(date, "dd-MM-yyyy"))
    // const formatedDate = format(date, "dd-MM-yyyy");
    dispatch(fetchDays(loadedDate));
    dispatch(fetchVisits(loadedDate));
  };

  return (!loadingDays && !loadingPersons && !loadingActivities) ? (
    <>
      <div className="mainPage">
      <h1>days{loadingDays.toString()}persons{loadingPersons.toString()}activities{loadingActivities.toString()}</h1>
        <Calendar
          className="calendar calendarMain"
          value={parse(loadedDate, "dd-MM-yyyy", new Date())}
          onChange={date => changeLoadDate(date)}
        />
        <div className="notesMain font-white-shadow">
          <AreaNotes notesValue={dayData?.notes} type="DAY_DATA" date={dayData?.date} />
        </div>
        {isToday(loadedDate) ? (
          <div className="newCodeField">
            <CodeScanner dayObject={dayData} date={loadedDate} />
          </div>
        ) : (
            undefined
          )}
      </div>
      <TableForScanner />
    </>
  ) : <Spinner />

};


export default MainPage;


// return (!loadingDays && !loadingPersons) ? (
  //   <>
  //       <div className="notesMain font-white-shadow">
  //         <AreaNotes notesValue={data?.notes} type="DAY_DATA" dayObject={data} />
  //       </div>
  //       <div className="newProfileField">
  //         <FormData
  //           baseValue=""
  //           formLabel="Новый профиль:"
  //           type="NEW_PERSON"
  //           route={history}
  //         />
  //       </div>
  //       {isToday(loadedDate) ? (
  //         <div className="newCodeField">
  //           <CodeScanner dayObject={data} date={loadedDate} />
  //         </div>
  //       ) : (
  //           undefined
  //         )}
  //     </div>
  //     <TableForScanner data={dayData[indexDate]} />
  //   </>
  // ) : <Spinner />