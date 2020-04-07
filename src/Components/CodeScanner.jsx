/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { format, fromUnixTime } from 'date-fns'
import { useDispatch, useSelector } from "react-redux";
import { addNewDayDataToJSON, getIndexByCode } from '../App';
import { getPersonStore } from '../store/storeGetters'
import { chgProfileValue, addNewProfile } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";


/* code scanner => 
  0. Check if user exist => if not => CREATE NEW PROFILE
  1. Check if user already in today history (ON CLIENT)
  2. If not => add to today history and check if it has REMAIN field
  3. If has => changeValue 
  4. Add to history - mb in redux add

newProfile field =>
  1.CREATE NEW PROFILE
  2.SEND NEW CODE TO HISTORY
*/




const CodeScanner = (props) => {
  const personData = useSelector(state => state.personsStore.data);
  const historyData = useSelector(state => state.activitiesStore.data);
  const dispatch = useDispatch();

  // function substractOneRemain(code) {
  //   // const personData = getPersonStore();
  //   const index = getIndexByCode(code);
  //   const person = personData[index];
  //   if (person.remain !== "") dispatch(chgProfileValue(code, 'remain'), (+person.remain - 1));
  // }

  // function addToTodayHistory(code, dayObject) {

  //   const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
  //   // find if person already in history
  //   const index = dayObject.history.findIndex(x => x.code === code);
  //   if (index === -1) {
  //     dayObject.history.push(codeObj);
  //     substractOneRemain(code);
  //   }
  //   addNewDayDataToJSON(dayObject);
  // }

  function handleNewCode(code, dayObject) {
    // find if in history
    const indexHistory = historyData.findIndex(person => person.code === code);
    if (indexHistory === -1) {
      // find if in persons
      const indexPerson = personData.findIndex(person => person.code === code);
      if (index === -1) {
        dispatch(addNewProfile(code));
        dispatch(addToHistory(code, format(date, "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss')));
      } else {
        // dispatch 
      }
      // TODO find if already in history..

      // If code not in db => create new + add to history. If already in db => add to history 
      // if (index === -1) {
      //   dispatch(addNewProfile(code));

      //   addToTodayHistory(code, dayObject);
      // } else {
      //   addToTodayHistory(personData[index].code, dayObject);
      // }
    }
  }

  const [code, setCode] = useState('');
  const enterCode = (event) => {
    event.preventDefault();
    const codeSaved = code;
    setCode(''); // clear codeField
    handleNewCode(codeSaved, props.dayObject);
  }
  return (
    <>
      <label>Сканер карт:</label>
      <form name="codeForm" onSubmit={enterCode}>
        <input required minLength={1} placeholder="Введите код" type="text" name={props.inputType} onChange={event => setCode(event.target.value)} value={code} />
      </form>
    </>
  );
}

export default CodeScanner;