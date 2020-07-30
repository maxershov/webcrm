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
  const [renderModal, setRenderModal] = useState(false);
  const oldFieldValue = person[inputType]

  function askForChange() {
    if (oldFieldValue !== inputValue) setRenderModal(true);
  }

  function closeModal() {
    setRenderModal(false);
    setValue(oldFieldValue);
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
    setRenderModal(false);
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
          onBlur={askForChange}
          value={inputValue}
          list={listName}
        />
        <datalist id="types">
          <option value={inputValue}>{inputValue}</option>
          <option value="СОТРУДНИК">тип профиля</option>
          <option value="1 СВОБ">тип профиля</option>
          <option value="1 СВОБ УТРО">тип профиля</option>
          <option value="1 КФ">тип профиля</option>
          <option value="1 ТА">тип профиля</option>
          <option value="1 ПОЛНЫЙ">тип профиля</option>
          <option value="МГР">тип профиля</option>
          <option value="ПТ">тип профиля</option>
          <option value="ЛИД">тип профиля</option>
          <option value="НЕТ">тип профиля</option>
        </datalist>
      </form>
      {renderModal ? (
        <div className="modal">
          <p>Изменить:</p>
          <p>{oldFieldValue} => {inputValue}</p>
          <div className="one-line-wrapper">
            <button className="button block-button" type="button" onClick={sendToDb}>ДА</button>
            <button className="button block-button" type="button" onClick={closeModal}>НЕТ</button>
          </div>
        </div>
      )
        : undefined}
    </div>
  );
});


export default InputProfile;