import React from 'react';
import './App.css';
import './react-table.css';
import './react-calendar.css';
import { format, differenceInDays, parse, startOfDay } from 'date-fns'
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './Components/MainContent';
import Header from './Components/Header';
import store from './store/store'
import { getPersonStore, getDayDataStore, getActivityStore, getActivityStoreCode } from './store/storeGetters'
import host from '../host'


const App = (props) => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <MainContent />
      </Router>
    </Provider>
  );
}


function sendData(data, dataType) {
  fetch(`http://${host.host}:6700/${dataType}`, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data
    })
  });
}

function changeCodeDayData(oldCode, newCode) {
  // if change code in personData => change code in historyData
  const data = getDayDataStore();
  data.forEach(element => {
    element.history = element.history.filter(obj => {
      if (obj.code === oldCode) return obj.code = newCode;
    });
  });
  saveData(data, 'DAY');
}

export function deletePerson(codeToDel) {
  deleteCodeDayData(codeToDel);
  const personData = getPersonStore();
  const newPersonData = personData.filter(obj => obj.code !== codeToDel);

  const activityData = getActivityStore();
  const newActivityData = activityData.filter(obj => obj.code !== codeToDel);
  saveData(newPersonData, 'PERSON');
  saveData(newActivityData, 'ACTIVITY');
}

function deleteCodeDayData(codeToDel) {
  const data = getDayDataStore();
  data.forEach(element => {
    element.history = element.history.filter(obj => {
      return obj.code !== codeToDel
    });
  }
  );
  saveData(data, 'DAY');
}

export function getIndexByCode(code) {
  return getPersonStore().findIndex(x => x.code === code);
}

export function getDateObj(dateTo) {
  const data = getDayDataStore();
  const indexDate = data.findIndex(x => x.date === dateTo);
  return data[indexDate];
}

export function addNewDayDataToJSON(obj) {
  const data = getDayDataStore();
  const indexDate = data.findIndex(x => x.date === obj.date);
  if (indexDate !== -1) {
    data[indexDate] = obj;
    saveData(data, 'DAY');
  }
}


export function addNewPersonToJSON(code, renderProfile, route) {
  const data = getPersonStore();
  const indexDate = data.findIndex(x => x.code === code);
  if (indexDate !== -1) code += '*';
  const newPerson = { "personName": code, "contract": "", "dateBirth": "", "telNum": "", "code": code, "autoMonth": "", "notes": "", "remain": "", "days": "", "photoId": 0, "rent": "", "deposite": "", };
  data.push(newPerson);
  saveData(data, 'PERSON');
  addNewActivityDataToJSON({ "code": code, "activity": [{ "date": format(new Date(), 'dd-MM-yyyy'), "time": format(new Date(), 'HH:mm:ss'), "type": "Создание профиля", "person": "", "amount": "" }] });

  if (renderProfile) {
    // Open profile page with new person
    route.push(`/profile/${code}`)
  }
}


export function pushNewActivity(code, activityObj) {
  const data = getActivityStoreCode(code);
  data[0].activity.push(JSON.parse(activityObj));
  addNewActivityDataToJSON(data[0]);
}

export function addNewActivityDataToJSON(obj) {
  // take JSON string like {code:'123456, activity:[{...}]} and find, if already in list => change; if not in list => push new
  const data = getActivityStore();
  const indexDate = data.findIndex(x => x.code === obj.code);
  if (indexDate !== -1) {
    data[indexDate] = obj;
    saveData(data, 'ACTIVITY');
  } else {
    data.push(obj);
    saveData(data, 'ACTIVITY');
  }
}

function changeCode(oldCode, newCode, activityObj) {
  // TODO set URL => '/new code'

  const data = getActivityStore();
  const id = data.findIndex(x => x.code === oldCode);
  data[id].code = newCode;
  data[id].activity.push(activityObj);
  saveData(data, 'ACTIVITY');
  changeCodeDayData(oldCode, newCode);
}


export function ChangeProfileValue(code, inputValue, inputType, date = format(new Date(), 'dd-MM-yyyy')) {
  /** Change field in profiles page -> get data from field and change in JSON file -> send to SQL dB */
  const data = getPersonStore();
  const id = getIndexByCode(code);
  const oldFieldValue = data[id][inputType];
  data[id][inputType] = inputValue;

  // in LEAD date field used for first call date. In PERSON used for rent => change LEAD to other => rent=""
  if (oldFieldValue === 'ЛИД' && inputType === 'contract') data[id].rent = "";

  let time = format(new Date(), 'HH:mm:ss');
  // Set time to 00:00:00 if date not today => doesn't set incorrect time)
  if (date !== format(new Date(), 'dd-MM-yyyy')) time = '00:00:00'
  const activityObj = { "date": date, "time": time, "type": `Изменение ${inputType}`, "person": "", "amount": `${oldFieldValue} => ${inputValue}` };

  // use different func for code => to change URL and other
  if (inputType === 'code') changeCode(oldFieldValue, inputValue, activityObj);

  if (inputType !== 'photoId' && inputType !== 'notes' && inputType !== 'code') pushNewActivity(data[id].code, JSON.stringify(activityObj));
  saveData(data, 'PERSON');
}

export function getDaysLeft(date) {
  if (date === "") return date;
  return differenceInDays(startOfDay(parse(date, 'dd-MM-yyyy', new Date())), startOfDay(new Date()));
}


function saveData(data, dataType) {
  switch (dataType) {
    case 'PERSON':
      store.dispatch({ type: 'LOADING_PERSON' });
      store.dispatch({ type: 'CHANGE_PERSON_DATA', data });
      sendData(data, 'changepersons');
      break;
    case 'DAY':
      store.dispatch({ type: 'LOADING_DAY' });
      store.dispatch({ type: 'CHANGE_DAY_DATA', data });
      sendData(data, 'changeday');
      break;
    case 'ACTIVITY':
      store.dispatch({ type: 'LOADING_ACTIVITIES' });
      store.dispatch({ type: 'CHANGE_ACTIVITIES_DATA', data });
      sendData(data, 'changeactivities');
      break;
    default:
      break;
  }
}

export default App;