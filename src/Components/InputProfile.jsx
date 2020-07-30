import React, { useState } from 'preact/compat';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { chgProfileValue, chgCode } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";
import { activitiesTypes } from "../App";

const InputProfile = React.memo(props => {
  const { formLabel, baseValue, inputType, listName } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { codeLink } = useParams();
  const person = useSelector(state => state.profileStore.data);
  const [inputValue, setValue] = useState(baseValue);
  const oldFieldValue = person[inputType]

  function askForChange(){
    console.log(oldFieldValue);
    console.log(inputValue)
  }

  const sendToDb = (event) => {
    event.preventDefault();
    if (oldFieldValue === 'ЛИД') dispatch(chgProfileValue(codeLink, "rent", ""));
    if (inputType === 'code') {
      dispatch(chgCode(codeLink, inputValue));
      history.push('/main');
    }
    else {
      dispatch(chgProfileValue(codeLink, inputType, inputValue));
      dispatch(addToHistory(codeLink, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), `Изменение ${activitiesTypes[inputType]}`, "", `${oldFieldValue} => ${inputValue}`));
    }
  }


  return (
    <div className="input-form">
      <form name="myForm" onSubmit={sendToDb}>
        <label className="label">{formLabel}</label>
        <input
          className="input input--hidable"
          placeholder={`Добавить ${formLabel.toLowerCase()}`}
          type="text"
          name={inputType}
          onChange={event => setValue(event.target.value.trim())}
          onBlur={() => alert("BLUR")}
          value={inputValue}
          list={listName}
        />
        <datalist id="types">
          <option value={inputValue}>{inputValue}</option>
          <option value="СОТРУДНИК">тип профиля</option>
          <option value="ЛИД">тип профиля</option>
          <option value="НЕТ">тип профиля</option>
          <option value="1 СВОБ">тип профиля</option>
          <option value="1 СВОБ УТРО">тип профиля</option>
          <option value="3 КФ">тип профиля</option>
          <option value="6 ТА">тип профиля</option>
        </datalist>
        <button className="button button--hidable" type="submit">Изменить</button>
      </form>
    </div>
  );
});


export default InputProfile;