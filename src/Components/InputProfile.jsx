import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { chgProfileValue, chgCode } from "../store/profileStore/profileActions";

const InputProfile = (props) => {

  const { formLabel, baseValue, inputType } = props;
  const { codeLink } = useParams();
  const [inputValue, setValue] = useState(baseValue);
  const placeholder = `Добавить ${formLabel.slice(0, -1).toLowerCase()}`;

  const dispatch = useDispatch(); 
  const history = useHistory();

  const sendToDb = (event) => {
    event.preventDefault();
    if (inputType === 'code') {
      dispatch(chgCode(codeLink, inputValue));
      // TODO push new code
      history.push('/main');
    }
    else dispatch(chgProfileValue(codeLink, inputType, inputValue));

    // TODO add dispatch with activity
    
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