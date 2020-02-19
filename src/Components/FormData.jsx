import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import { ChangeProfileValue, addNewPersonToJSON } from '../App';

import host from "../../host";

const FormData = (props) => {

  // Pass @route for last prop => to use history.push on input(MainPage - new Person) to open new profile
  const {formLabel, baseValue, inputType, type, route=''} = props;
  const { codeLink } = useParams();
  const [inputValue, setValue] = useState(baseValue);
  const placeholder = `Добавить ${  formLabel.slice(0, -1).toLowerCase()}`;
  const sendToDb = (event) => {
    event.preventDefault();
    // fetch(`http://${host.host  }:6700/changepersons`, {
    //   method:'post',
    //   headers: {'Content-Type':'application/json'},
    //   body: JSON.stringify({
    //     type: inputType, 
    //     value: inputValue })
    // });

    if (type === 'PERSON') ChangeProfileValue(codeLink, inputValue, inputType);
    if (type === 'NEW_PERSON') {
      // create new profile and open it's page
      addNewPersonToJSON(inputValue, true, route);
    }
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



export default FormData;