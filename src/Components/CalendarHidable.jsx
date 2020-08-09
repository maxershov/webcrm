import { h } from "preact";
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'preact/compat';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns'
import Calendar from 'react-calendar';
import { useDispatch, useSelector } from "react-redux";
import { chgProfileValue } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";
import { activitiesTypes } from "../App";

const CalendarHidable = (props) => {
  const dispatch = useDispatch();
  const [renderCalendar, setRenderCalendar] = useState(false);
  const { codeLink } = useParams();
  const person = useSelector(state => state.profileStore.data);
  const oldFieldValue = person[props.dateType];


  function changeDate(dateTo) {
    const date = format(dateTo, 'dd-MM-yyyy');
    if (props.dateType === 'setParent') {
      props.setParentDate(date)
    } else {
      dispatch(chgProfileValue(codeLink, props.dateType, date));
      dispatch(addToHistory(codeLink, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), `Изменение ${activitiesTypes[props.dateType]}`, "", `${oldFieldValue} => ${date}`));
    }
    setRenderCalendar(false);
  }


  function deleteDate() {
    dispatch(chgProfileValue(codeLink, props.dateType, ""));
    setRenderCalendar(false);
  }


  return (
    <>
      <div className={`${props.dateType}Field`}>
        <label className="label">{props.calendarName}</label>
        <input className="input" onClick={() => setRenderCalendar('block')} type="text" readOnly value={props.date} />
      </div>
      {renderCalendar ? (
        <div className="modal">
          <Calendar className="calendar" onChange={date => changeDate(date)} />
          <div className="one-line-wrapper">
            <button className="button block-button" type="button" onClick={() => setRenderCalendar(false)}>Убрать календарь</button>
            <button className="button block-button" type="button" onClick={() => deleteDate()}>Удалить дату</button>
          </div>
        </div>
      ) : undefined}

    </>
  );
}


export default CalendarHidable;