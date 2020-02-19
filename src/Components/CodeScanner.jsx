/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { format } from 'date-fns'
import { addNewDayDataToJSON, addNewPersonToJSON, ChangeProfileValue, getIndexByCode } from '../App';
import { getPersonStore } from '../store/storeGetters'



function substractOneRemain(code){
  const personData = getPersonStore();
  const index = getIndexByCode(code);
  const person = personData[index];
  if (person.remain !== "") ChangeProfileValue(code, (+person.remain -1) , 'remain',);
}


function addToTodayHistory(code, dayObject) {
  const codeObj = { "code": code, "time": format(new Date(),'HH:mm:ss') };
  // find if person already in history
  const index = dayObject.history.findIndex(x => x.code === code);
  if (index === -1) {
    dayObject.history.push(codeObj);
    substractOneRemain(code);
  }
  addNewDayDataToJSON(dayObject);
}


function handleNewCode(code, dayObject) {
  const personData = getPersonStore();
  const index = personData.findIndex(person => person.code === code);
  // TODO find if already in history..

  // If code not in db => create new + add to history. If already in db => add to history 
  if (index === -1) {
    addNewPersonToJSON(code, false);
    addToTodayHistory(code, dayObject);
  } else {
    addToTodayHistory(personData[index].code, dayObject);
  }
}

const CodeScanner = (props) => {
  const [code, setCode] = useState('');
  const enterCode = (event) => {
    event.preventDefault();
    const codeDb = code;
    setCode(''); // clear codeField
    handleNewCode(codeDb, props.dayObject);
  }
  return (
    <>
      <label>Сканер карт:</label>
      <form name="codeForm" onSubmit={enterCode}>
        <input required minLength={1} placeholder="Нажмите на поле и прислоните карту" type="text" name={props.inputType} onChange={event => setCode(event.target.value)} value={code} />
      </form>
    </>
  );
}

export default CodeScanner;