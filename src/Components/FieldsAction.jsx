import React, { useState } from 'preact/compat';
import { format } from 'date-fns'
import { useDispatch } from "react-redux";
import CalendarHidable from './CalendarHidable';
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";
import { isToday } from "../App";


const FieldsAction = (props) => {
  const [actionType, setActionType] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [actionDate, setActionDate] = useState(format(new Date(), 'dd-MM-yyyy'));
  const [actionPerson, setActionPerson] = useState('');
  let time = format(new Date(), 'HH:mm:ss');
  const dispatch = useDispatch();


  const sendActionsToDb = (event) => {
    event.preventDefault();
    if (!isToday(actionDate)) time = "00:00:00";
    dispatch(addToHistory(props.code, actionDate, time, actionType, actionPerson, actionAmount));
  }

  return (
    <div className="FieldsAction">
      <form onSubmit={sendActionsToDb}>
        <label>Тип события</label>
        <input type="text" value={actionType} placeholder="Выберите или введите тип события" name="type" list="typeList" onChange={event => setActionType(event.target.value.trim())} />
        <datalist id="typeList">
          <option value="">Выбрать тип</option>
          <option value="Заморозка">Заморозка</option>
          <option value="Продажа">Продажа</option>
          <option value="Посещение">Посещение</option>
          <option value="ПТ">ПТ</option>
          <option value="Минигруппа">Минигруппа</option>
          <option value="Шкафчик">Шкафчик</option>
          <option value="Парковка">Парковка</option>
        </datalist>
        <div>
          <label>Данные события</label>
          <input type="text" placeholder="Введите текст или сумму" onChange={event => setActionAmount(event.target.value)} value={actionAmount} />
        </div>
        <div>
          <label>Клиент/сотрудник</label>
          <input type="text" value={actionPerson} placeholder="Выберите сотрудника/клиента" list="personList" onChange={event => setActionPerson(event.target.value)} />
          <datalist id="personList">
            <option value="">Выбрать тренера</option>
            {props.namesArr.map((person) =>
              <option key={person} value={person}>{person}</option>)}
          </datalist>
        </div>
        <CalendarHidable setParentDate={setActionDate} calendarName="Дата события" dateType="setParent" date={actionDate} />
        <button className="absolute_btn" type="submit">Добавить событие</button>
      </form>
    </div>
  );
}


export default FieldsAction;