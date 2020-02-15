import React, { useState } from 'react';
import { format} from 'date-fns'
import CalendarHideable from './CalendarHideable';
import { pushNewActivity} from '../App';



const MyActionFields = (props) => {
  const [actionType, setActionType] = useState('');
  const [actionAmout, setActionAmout] = useState('');
  const [actionDate, setActionDate] = useState(format(new Date(),'dd-MM-yyyy'));  // change!
  const [actionPerson, setActionPerson] = useState('');
  const sendActionsToDb = (event) => {
    event.preventDefault();
    const newActivity = { "date": actionDate, "time": format(new Date(),'HH:mm:ss'), "type": actionType, "person": actionPerson, "amount": actionAmout };
    pushNewActivity(props.code, JSON.stringify(newActivity));
  }
  return (
    <div className="FieldsAction">
      <form onSubmit={sendActionsToDb}>
        <label>Тип события:</label>
        <input type="text" value={actionType} placeholder="Выберите или введите тип события" name="type" list="typeList" onChange={event => setActionType(event.target.value)} />
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
          <label>Данные события:</label>
          <input type="text" placeholder="Введите текст или сумму" onChange={event => setActionAmout(event.target.value)} value={actionAmout} />
        </div>
        <div>
          <label>Клиент/сотрудник:</label>
          <input type="text" value={actionPerson} placeholder="Выберите сотрудника/клиента" list="personList" onChange={event => setActionPerson(event.target.value)} />
          <datalist id="personList">
            <option value="">Выбрать тренера</option>
            {props.namesArr.map((person) =>
              <option key={person} value={person}>{person}</option>)}
          </datalist>
        </div>
        <CalendarHideable setParentDate={setActionDate} сalendarName="Дата события:" dateType="setParent" date={actionDate} />
        <button type="submit">Добавить событие</button>
      </form>
    </div>
);
}



export default MyActionFields;