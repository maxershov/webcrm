/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { chgProfileValue, addNewProfile } from "../store/profileStore/profileActions";
import { addToVisits } from "../store/activitiesDataStore/activitiesDataActions";


const CodeScanner = (props) => {
  const { type, route, divName } = props;
  const personData = useSelector(state => state.personsStore.data);
  const historyData = useSelector(state => state.activitiesStore.data);
  const dispatch = useDispatch();


  function createProfile(code) {
    // code.replace handle in backend => i need name for profile with spaces
    dispatch(addNewProfile(code));
    // open user page with new profile
    route.push(`/profile/${code.replace(/ /g, '')}`)
  }


  function substractOneRemain(code, index) {
    const person = personData[index];
    if (Number.isInteger(person.remain)) {
      dispatch(chgProfileValue(code, 'remain', (person.remain - 1)));
      return `УЧЁТ ${person.remain} => ${(person.remain - 1)}`;
    } return "";
  }


  function handleNewCode(code) {
    // find if in today history
    code = code.replace(/ /g, '');
    const indexHistory = historyData.findIndex(person => person.code === code);
    let amount = "";
    if (indexHistory === -1) {
      // find if in persons => if not => create new profile and add to history
      const indexPerson = personData.findIndex(person => person.code === code);
      if (indexPerson === -1) dispatch(addNewProfile(code));
      else amount = substractOneRemain(code, indexPerson);

      dispatch(addToVisits(code, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), amount));
    }
  }


  const [code, setCode] = useState('');

  const enterCode = (event) => {
    event.preventDefault();
    const codeSaved = code;
    setCode(''); // clear codeField
    if (type === 'SCANNER') handleNewCode(codeSaved);
    if (type === 'PROFILE') createProfile(codeSaved);
  }

  return (
    <div className={divName}>
      <label>{type === 'PROFILE' ? "Создать профиль" : "Сканер карт"}</label>
      <form name="codeForm" onSubmit={enterCode}>
        <input required minLength={1} placeholder=" Введите данные" type="text" name={props.inputType} onChange={event => setCode(event.target.value)} value={code} />
      </form>
    </div>
  );
}


export default CodeScanner;