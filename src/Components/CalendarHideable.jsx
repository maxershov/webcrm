import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns'
import Calendar from 'react-calendar/dist/entry.nostyle';
import { useDispatch, useSelector } from "react-redux";
import { chgProfileValue } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";

const CalendarHideable = (props) => {
  const dispatch = useDispatch();
  const [renderCalendar, setRenderCalendar] = useState('none');
  const { codeLink } = useParams();
  const person = useSelector(state => state.profileStore.data);
  const oldFieldValue = person[props.dateType];

  function changeDate(dateTo) {
    const date = format(dateTo, 'dd-MM-yyyy');
    if (props.dateType === 'setParent') {
      props.setParentDate(date)
    } else {
      dispatch(chgProfileValue(codeLink, props.dateType, date));
      dispatch(addToHistory(codeLink, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), `Изменение ${props.dateType}`, "", `${oldFieldValue} => ${date}`));

    }

    setRenderCalendar('none');
  }

  function deleteDate() {
    dispatch(chgProfileValue(codeLink, props.dateType, ""));
    setRenderCalendar('none');
  }
  return (
    <>
      <div className={`${props.dateType}Field`}>
        <label>{props.сalendarName}</label>
        <input onClick={() => setRenderCalendar('block')} type="text" readOnly value={props.date} />
      </div>
      <div style={{ display: renderCalendar }} className="calendar" id="calendar">
        <Calendar className="calendar" onChange={date => changeDate(date)} />
        <button type="button" onClick={() => setRenderCalendar('none')}>Убрать календарь</button>
        <button type="button" onClick={() => deleteDate()}>Удалить дату</button>
      </div>
    </>
  );
}

export default CalendarHideable;