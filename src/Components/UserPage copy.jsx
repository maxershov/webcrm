/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { deletePerson, getImg } from '../App';
import FormData from './FormData';
import CalendarHideable from './CalendarHideable';
import FieldDeposite from './FieldDeposite';
import FieldsAction from './FieldsAction';
import TableHistory from './TableHistory';
import AreaNotes from './AreaNotes';
import Spinner from './Spinner'


function getAllPersonNames(data) {
  return data.map(obj => { return obj.personName });
}

export const UserPage = (props) => {
  const personData = useSelector(state => state.personsStore.data);
  const loading = useSelector(state => state.personsStore.loading);
  /** Show fields with User data and change it on submit */
  const [renderPhotoId, changeRenderPhotoId] = useState(false);
  const { codeLink } = useParams();
  const history = useHistory();

  let person = personData.find(profile => {
    return profile.code === codeLink
  })

  if (person === undefined) {
    // TODO kill this CRAP => prevent from crash if unvalid code in URL path
    [person,] = personData;
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
            <FormData code={person.code} className="photoId" formLabel="Изменить код фото:" baseValue={person.photoId} inputType="photoId" type="PERSON" />
            <label>Удаление:</label>
            <button type="button" onClick={() => deletePerson(person.code)}>Удалить пользователя</button>
          </>
        ) : undefined}
        <FormData code={person.code} formLabel="Имя:" baseValue={person.personName} inputType="personName" type="PERSON" />
        <FormData code={person.code} formLabel="Номер телефона:" baseValue={person.telNum} inputType="telNum" type="PERSON" />
        
        {renderFields}
        
      </div>
      <div className="notesField">
        <label>Заметки:</label>
        <AreaNotes notesValue={person.notes} type="PERSON" />
      </div>
      <FieldsAction code={person.code} namesArr={getAllPersonNames(personData)} />
      <TableHistory tableDataType="personData" code={person.code} />
    </div>
  );
}

export const PersonParams = (props) => {
  const { person } = props;
  return (
    <>
      <FormData code={person.code} formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" type="PERSON" />
      <FormData code={person.code} formLabel="Абонемент:" baseValue={person.contract} inputType="contract" type="PERSON" />
      <FormData code={person.code} formLabel="Остаток тренировок:" baseValue={person.remain} inputType="remain" type="PERSON" />
      <FormData code={person.code} formLabel="Код карты:" baseValue={person.code} inputType="code" type="PERSON" />
      <FormData code={person.code} formLabel="Месяц парковки:" baseValue={person.autoMonth} inputType="autoMonth" type="PERSON" />
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
      <FormData code={person.code} formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" type="PERSON" />
      <CalendarHideable сalendarName="Дата первого обращения:" dateType="rent" date={person.rent} />
    </>
  )
}

export const LostPersonParams = (props) => {
  const { person } = props;
  return (
    <>
      <FormData code={person.code} formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" type="PERSON" />
      <FormData code={person.code} formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" type="PERSON" />
      <FormData code={person.code} formLabel="Код карты:" baseValue={person.code} inputType="code" type="PERSON" />
      <FieldDeposite depositeValue={person.deposite} />
      <CalendarHideable сalendarName="Дата окончания контракта:" dateType="days" date={person.days} />
    </>
  )
}


export const EmployeeParams = (props) => {
  const { person } = props;
  return (
    <>
      <FormData code={person.code} formLabel="Дата рождения:" baseValue={person.dateBirth} inputType="dateBirth" type="PERSON" />
      <FormData code={person.code} formLabel="Тип профиля:" baseValue={person.contract} inputType="contract" type="PERSON" />
      <FormData code={person.code} formLabel="Код карты:" baseValue={person.code} inputType="code" type="PERSON" />
      <FormData code={person.code} formLabel="Парковка оплачена до:" baseValue={person.autoMonth} inputType="autoMonth" type="PERSON" />
      <FieldDeposite depositeValue={person.deposite} />
    </>
  )
}


export default UserPage;