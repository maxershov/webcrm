import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { chgProfileValue } from "../store/profileStore/profileActions";

const InputProfile = (props) => {

  // Pass @route for last prop => to use history.push on input(MainPage - new Person) to open new profile
  const { type, code } = props;
  const forCode = (type === 'code');
  const [inputValue, setValue] = useState(baseValue);
  const placeholder = `Добавить ${formLabel.slice(0, -1).toLowerCase()}`;

  const dispatch = useDispatch();

  const sendToDb = (event) => {
    event.preventDefault();
    dispatch(chgProfileValue(codeLink, inputType, inputValue));
  }
  return (
    <div className={`${inputType}Field absolute_position_button`}>
      <form name="myForm" onSubmit={sendToDb}>
        <label>{formLabel}</label>
        <input placeholder={placeholder} type="text" name={inputType} onChange={event => setValue(event.target.value)} value={inputValue} />
        <button type="submit">Изменить</button>
      </form>
    </div>
  );
}



export default InputProfile;