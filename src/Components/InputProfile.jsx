import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { format } from 'date-fns';
import { chgProfileValue, chgCode } from "../store/profileStore/profileActions";
import { addToHistory } from "../store/activitiesDataStore/activitiesDataActions";

const InputProfile = (props) => {
  const { formLabel, baseValue, inputType } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { codeLink } = useParams();
  const person = useSelector(state => state.profileStore.data);
  const [inputValue, setValue] = useState(baseValue);
  const oldFieldValue = person[inputType]


  const sendToDb = (event) => {
    event.preventDefault();
    if (oldFieldValue === 'ЛИД') dispatch(chgProfileValue(codeLink, "rent", ""));
    if (inputType === 'code') {
      dispatch(chgCode(codeLink, inputValue));
      history.push('/main');
    }
    else {
      dispatch(chgProfileValue(codeLink, inputType, inputValue));
      dispatch(addToHistory(codeLink, format(new Date(), "dd-MM-yyyy"), format(new Date(), 'HH:mm:ss'), `Изменение ${inputType}`, "", `${oldFieldValue} => ${inputValue}`));
    }
  }


  return (
    <div className={`${inputType}Field absolute_position_button`}>
      <form name="myForm" onSubmit={sendToDb}>
        <label>{formLabel}</label>
        <input
          placeholder={`Добавить ${formLabel.slice(0, -1).toLowerCase()}`}
          type="text"
          name={inputType}
          onChange={event => setValue(event.target.value)}
          value={inputValue}
        />
        <button type="submit">Изменить</button>
      </form>
    </div>
  );
}


export default InputProfile;