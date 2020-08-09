import { h } from "preact";
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'preact/compat';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom'

import CalendarHidable from './CalendarHidable';
import FieldDeposite from './FieldDeposite';
import FieldsAction from './FieldsAction';
import TableHistory from './TableHistory';
import AreaNotes from './AreaNotes';
import InputProfile from './InputProfile';

import { fetchProfile, deleteProfile } from "../store/profileStore/profileActions";
import { fetchHistory } from "../store/activitiesDataStore/activitiesDataActions";


function getPersonNames(data) {
  if (data === undefined) return [];
  return data.map(obj => { return obj.personName });
}


export const UserPage = () => {
  const persons = useSelector(state => state.personsStore.data);
  const person = useSelector(state => state.profileStore.data);
  const loading = useSelector(state => state.profileStore.loading);
  const [renderPhotoId, changeRenderPhotoId] = useState(false);
  const { codeLink } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  document.title = person.personName;

  useEffect(() => {
    dispatch(fetchProfile(codeLink));
    dispatch(fetchHistory(codeLink))
  }, [codeLink, dispatch]);


  function handleFiles(file) {
    const formData = new FormData()
    formData.append("img", file[0])
    fetch(`/upload/${codeLink}`, {
      method: 'POST',
      body: formData
    })
  }


  if (person === undefined) {
    history.push('/main');
  }


  function delProfile(code) {
    dispatch(deleteProfile(code))
    history.push('/main');
  }


  let renderFields = '';
  if (person.contract === 'ЛИД') renderFields = <LeadParams person={person} />
  else if (person.contract === 'СОТРУДНИК') renderFields = <EmployeeParams person={person} />
  else renderFields = <PersonParams person={person} />


  return loading ? <span className="spinner" /> : (
    <div className="userPage">
      <div className="img-container"><input className="person-img" type="image" onClick={() => changeRenderPhotoId(!renderPhotoId)} alt="profilePhoto" src={`/images/${person.photoId}`} /></div>
      <div className="userPage-container">
        {renderPhotoId ? (
          <>
            <InputProfile formLabel="Изменить код фото" baseValue={person.photoId} inputType="photoId" />
            <input className="button input-file" type="file" name="img" accept="image/*,image/jpeg" onChange={(e) => handleFiles(e.target.files)} />
            <label className="label">Удаление</label>
            <button className="button" type="button" onClick={() => delProfile(person.code)}>Удалить пользователя</button>
          </>
        ) : undefined}
        <InputProfile formLabel="Имя" baseValue={person.personName} inputType="personName" />
        <InputProfile formLabel="Номер телефона" baseValue={person.telNum} inputType="telNum" />

        {renderFields}

      </div>
      <div className="userPage__notes">
        <AreaNotes notesValue={person.notes} type="PERSON" />
      </div>
      <FieldsAction code={person.code} namesArr={getPersonNames(persons)} />
      <TableHistory tableDataType="personData" code={person.code} />
    </div>
  );
}


export const PersonParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Дата рождения" baseValue={person.dateBirth} inputType="dateBirth" />
      <InputProfile formLabel="Абонемент" baseValue={person.contract} inputType="contract" listName="types" />
      <InputProfile formLabel="Остаток тренировок" baseValue={person.remain} inputType="remain" />
      <InputProfile formLabel="Код карты" baseValue={person.code} inputType="code" />
      <InputProfile formLabel="Месяц парковки" baseValue={person.autoMonth} inputType="autoMonth" />
      <CalendarHidable calendarName="Срок контракта" dateType="days" date={person.days} />
      <CalendarHidable calendarName="Срок аренды шкафа" dateType="rent" date={person.rent} />
      <FieldDeposite depositeValue={person.deposite} />
    </>
  )
}


export const LeadParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Тип профиля" baseValue={person.contract} inputType="contract" listName="types" />
      <CalendarHidable calendarName="Дата первого обращения" dateType="rent" date={person.rent} />
    </>
  )
}


export const EmployeeParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Дата рождения" baseValue={person.dateBirth} inputType="dateBirth" />
      <InputProfile formLabel="Тип профиля" baseValue={person.contract} inputType="contract" listName="types" />
      <InputProfile formLabel="Код карты" baseValue={person.code} inputType="code" />
      <InputProfile formLabel="Парковка оплачена до" baseValue={person.autoMonth} inputType="autoMonth" />
      <FieldDeposite depositeValue={person.deposite} />
    </>
  )
}


export default UserPage;