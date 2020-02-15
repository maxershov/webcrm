import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { format} from 'date-fns'
import Calendar from 'react-calendar/dist/entry.nostyle';
import { ChangeProfileValue } from '../App';


const CalendarHideable = (props) => {
  const [renderCalendar, setRenderCalendar] = useState('none');
  const { codeLink } = useParams();

  function changeDate(dateTo) {
    const date = format(dateTo, 'dd-MM-yyyy');
    props.dateType === 'setParent' ?
      props.setParentDate(date) :
      ChangeProfileValue(codeLink, date, props.dateType);
    setRenderCalendar('none');
  }

  function deleteDate() {
    ChangeProfileValue(codeLink, "", props.dateType);
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