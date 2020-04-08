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
    dispatch(addNewProfile(code));
    // open user page with new profile
    route.push(`/profile/${code.replace(/ /g, '')}`)
  }


  // function substractOneRemain(code, index) {
  //   const person = personData[index];
  //   if (person.remain !== "") dispatch(chgProfileValue(code, 'remain', (+person.remain - 1)));

  //   // TODO add dispatch to activity => without return activity for this profile!
  // }


  function handleNewCode(code) {
    // find if in history
    const indexHistory = historyData.findIndex(person => person.code === code);
    if (indexHistory === -1) {
      // find if in persons => if not => create new profile and add to history
      const indexPerson = personData.findIndex(person => person.code === code);
      if (indexPerson === -1) {
        dispatch(addNewProfile(code));
        dispatch(addToVisits(code, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss')));
        // TODO add activity {create profile...}

      } else {
        dispatch(addToVisits(code, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss')));
        // change dispatch position => one line after

        // substractOneRemain(code, indexPerson);
      }
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
      <label>{type === 'PROFILE' ? "Создать профиль:" : "Сканер карт:"}</label>
      <form name="codeForm" onSubmit={enterCode}>
        <input required minLength={1} placeholder=" Введите данные" type="text" name={props.inputType} onChange={event => setCode(event.target.value)} value={code} />
      </form>
    </div>
  );
}


export default CodeScanner;