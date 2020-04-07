import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { chgProfileValue, chgCode } from "../store/profileStore/profileActions";
import {addToHistory} from "../store/activitiesDataStore/activitiesDataActions";

const InputProfile = (props) => {

  // if (oldFieldValue === 'ЛИД' && inputType === 'contract') data[id].rent = "";

  const { formLabel, baseValue, inputType } = props;
  const { codeLink } = useParams();
  const [inputValue, setValue] = useState(baseValue);
  const person = useSelector(state => state.profileStore.data);
  const oldFieldValue = person[inputType]
  const placeholder = `Добавить ${formLabel.slice(0, -1).toLowerCase()}`;

  const dispatch = useDispatch(); 
  const history = useHistory();

  const sendToDb = (event) => {
    event.preventDefault();
    if (inputType === 'code') {
      dispatch(chgCode(codeLink, inputValue));
      // TODO push new code
      // TODO change code in activity
      history.push('/main');
    }
    else {
      dispatch(chgProfileValue(codeLink, inputType, inputValue)); 
      dispatch(addToHistory(codeLink, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), `Изменение ${inputType}`, "", `${oldFieldValue} => ${inputValue}`));
    }

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