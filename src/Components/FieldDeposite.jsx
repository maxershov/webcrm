import React, { useState } from 'react';
import { format } from 'date-fns'
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { chgProfileValue } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";
import CalendarHideable from './CalendarHideable';
import { isToday } from "../App";


const FieldDeposite = (props) => {
  const person = useSelector(state => state.profileStore.data);

  const dispatch = useDispatch();
  const { codeLink } = useParams();

  const [renderDeposite, changeRenderDeposite] = useState(false);
  const [amount, setAmount] = useState('');
  const [deposite, setDeposite] = useState(props.depositeValue);
  const [dateDeposite, setDateDeposite] = useState(format(new Date(), 'dd-MM-yyyy'))
  const oldFieldValue = person.deposite;
  let time = format(new Date(), 'HH:mm:ss');

  const plus = () => {
    const sum = +deposite + +amount;
    setDeposite(sum);
    if (!isToday(dateDeposite)) time = "00:00:00";
    changeRenderDeposite(false);
    dispatch(chgProfileValue(codeLink, 'deposite', sum));
    dispatch(addToHistory(codeLink, dateDeposite, time, `Изменение депозита`, "", `${oldFieldValue} => ${sum}`));
  }

  const minus = () => {
    const sum = +deposite - +amount;
    setDeposite(sum);
    if (!isToday(dateDeposite)) time = "00:00:00";
    changeRenderDeposite(false);
    dispatch(chgProfileValue(codeLink, 'deposite', sum));
    dispatch(addToHistory(codeLink, dateDeposite, time, `Изменение депозита`, "", `${oldFieldValue} => ${sum}`));
  }

  return (
    renderDeposite ?
      (
        <>
          <form>
            <label>Сумма списания/пополнения:</label>
            <br />
            <input className="numInput" type="number" width="40" height="50" value={amount} onChange={event => setAmount(event.target.value)} />
            <button type="button" style={{ float: "left", height: "30px", width: "50px" }} onClick={plus}>+</button>
            <button type="button" style={{ float: "left", height: "30px", width: "50px" }} onClick={minus}>-</button>
          </form>
          <CalendarHideable setParentDate={setDateDeposite} сalendarName="Дата изменения депозита:" dateType="setParent" date={dateDeposite} />
        </>
      )
      :
      (
        <>
          <form onSubmit={() => changeRenderDeposite(true)}>
            <label>Депозит:</label>
            <input onClick={() => changeRenderDeposite(true)} type="number" readOnly value={deposite} />
          </form>
        </>
      )
  );
}

export default FieldDeposite;