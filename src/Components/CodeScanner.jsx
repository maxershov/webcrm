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


  function createProfile(codeTo) {
    // code.replace handle in backend => i need name for profile with spaces
    dispatch(addNewProfile(codeTo));
    // open user page with new profile
    route.push(`/profile/${codeTo.replace(/ /g, '')}`)
  }


  function substractOneRemain(codeTo, index) {
    const person = personData[index];
    if (Number.isInteger(person.remain)) {
      dispatch(chgProfileValue(codeTo, 'remain', (person.remain - 1)));
      return `УЧЁТ ${person.remain} => ${(person.remain - 1)}`;
    } return "";
  }


  function handleNewCode(codeTo) {
    // find if in today history
    codeTo = codeTo.replace(/ /g, '');
    const indexHistory = historyData.findIndex(person => person.code === codeTo);
    let amount = "";
    if (indexHistory === -1) {
      // find if in persons => if not => create new profile and add to history
      const indexPerson = personData.findIndex(person => person.code === codeTo);
      if (indexPerson === -1) dispatch(addNewProfile(codeTo));
      else amount = substractOneRemain(codeTo, indexPerson);

      dispatch(addToVisits(codeTo, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), amount));
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