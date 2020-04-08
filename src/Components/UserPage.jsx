/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom'
import { fetchProfile, deleteProfile } from "../store/profileStore/profileActions";
import { fetchHistory } from "../store/activitiesDataStore/activitiesDataActions";
import { getImg } from '../App';
import CalendarHideable from './CalendarHideable';
import FieldDeposite from './FieldDeposite';
import FieldsAction from './FieldsAction';
import TableHistory from './TableHistory';
import AreaNotes from './AreaNotes';
import Spinner from './Spinner'
import InputProfile from './InputProfile';


function getAllPersonNames(data) {
  return data.map(obj => { return obj.personName });
}

export const UserPage = (props) => {
  const person = useSelector(state => state.profileStore.data);
  const loading = useSelector(state => state.profileStore.loading);
  const [renderPhotoId, changeRenderPhotoId] = useState(false);
  const { codeLink } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchProfile(codeLink));
    dispatch(fetchHistory(codeLink))
  }, [codeLink, dispatch]);


  if (person === undefined) {
    history.push('/main');
  }


  function delProfile(code) {
    dispatch(deleteProfile(person.code))
    history.push('/main');
  }


  let renderFields = '';
  if (person.contract === 'ЛИД') renderFields = <LeadParams person={person} />
  else if (person.contract === 'СОТРУДНИК') renderFields = <EmployeeParams person={person} />
  else if (person.contract === 'НЕТ') renderFields = <LostPersonParams person={person} />
  else renderFields = <PersonParams person={person} />

  return loading ? <Spinner /> : (
    <div className="userPage">
      <div className="img-container"><img onClick={() => changeRenderPhotoId(!renderPhotoId)} alt="profilePhoto" src={getImg(person.photoId)} /></div>
      <div className="userPage-container">
        {renderPhotoId ? (
          <>
            <InputProfile formLabel="Изменить код фото:" baseValue={person.photoId} inputType="photoId" />
            <label>Удаление:</label>
            <button type="button" onClick={() => delProfile(person.code)}>Удалить пользователя</button>
          </>
        ) : undefined}
        <InputProfile formLabel="Имя:" baseValue={person.personName} inputType="personName" />
        <InputProfile formLabel="Номер телефона:" baseValue={person.telNum} inputType="telNum" />

        {renderFields}

      </div>
      <div className="notesField">
        <label>Заметки:</label>
        <AreaNotes notesValue={person.notes} type="PERSON" />
      </div>
      <FieldsAction code={person.code} namesArr={[]} />
      <TableHistory tableDataType="personData" code={person.code} />
    </div>
  );
}

export const PersonParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" />
      <InputProfile formLabel="Абонемент:" baseValue={person.contract} inputType="contract" />
      <InputProfile formLabel="Остаток тренировок:" baseValue={person.remain} inputType="remain" />
      <InputProfile formLabel="Код карты:" baseValue={person.code} inputType="code" />
      <InputProfile formLabel="Месяц парковки:" baseValue={person.autoMonth} inputType="autoMonth" />
      <CalendarHideable сalendarName="Срок контракта:" dateType="days" date={person.days} />
      <CalendarHideable сalendarName="Срок аренды шкафа:" dateType="rent" date={person.rent} />
      <FieldDeposite depositeValue={person.deposite} />
    </>
  )
}


export const LeadParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" />
      <CalendarHideable сalendarName="Дата первого обращения:" dateType="rent" date={person.rent} />
    </>
  )
}


export const LostPersonParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" />
      <InputProfile formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" />
      <InputProfile formLabel="Код карты:" baseValue={person.code} inputType="code" />
      <FieldDeposite depositeValue={person.deposite} />
      <CalendarHideable сalendarName="Дата окончания контракта:" dateType="days" date={person.days} />
    </>
  )
}


export const EmployeeParams = (props) => {
  const { person } = props;
  return (
    <>
      <InputProfile formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" />
      <InputProfile formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" />
      <InputProfile formLabel="Код карты:" baseValue={person.code} inputType="code" />
      <InputProfile formLabel="Парковка оплачена до:" baseValue={person.autoMonth} inputType="autoMonth" />
      <FieldDeposite depositeValue={person.deposite} />
    </>
  )
}


export default UserPage;