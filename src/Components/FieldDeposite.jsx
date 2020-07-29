import React, { useState } from 'preact/compat';
import { format } from 'date-fns'
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { chgProfileValue } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";
import CalendarHidable from './CalendarHidable';
import { isToday } from "../App";


const FieldDeposite = React.memo(props => {
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
            <label className="label">Сумма списания/пополнения</label>
            <br />
            <input className="numInput" type="number" width="40" height="50" value={amount} onChange={event => setAmount(event.target.value)} />
            <div className="one-line-wrapper">
              <button className="button block-button" type="button" onClick={plus}>+</button>
              <button className="button block-button" type="button" onClick={() => changeRenderDeposite(false)}>ЗАКРЫТЬ</button>
              <button className="button block-button" type="button" onClick={minus}>-</button>
            </div>
          </form>
          <CalendarHidable setParentDate={setDateDeposite} calendarName="Дата изменения депозита" dateType="setParent" date={dateDeposite} />
        </>
      )
      :
      (
        <>
          <form onSubmit={() => changeRenderDeposite(true)}>
            <label className="label">Депозит</label>
            <input className="input" onClick={() => changeRenderDeposite(true)} type="number" readOnly value={deposite} />
          </form>
        </>
      )
  );
});


export default FieldDeposite;