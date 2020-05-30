import React from 'preact/compat';
import './App.css';
import './react-table.css';
import './react-calendar.css';
import { format, differenceInDays, parse, startOfDay } from 'date-fns'
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import MainContent from './Components/MainContent';
import Header from './Components/Header';
import store from './store/store'
import { getPersonStore } from './store/storeGetters'


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


export function isToday(date) {
  const todayDate = format(new Date(), "dd-MM-yyyy");
  return todayDate === date;
}


export function getIndexByCode(code) {
  return getPersonStore().findIndex(x => x.code === code);
}


export function getDaysLeft(date) {
  if (date === "") return date;
  return differenceInDays(startOfDay(parse(date, 'dd-MM-yyyy', new Date())), startOfDay(new Date()));
}

export const activitiesTypes = {
  "personName": "имени",
  "contract": "контракта",
  "dateBirth": "даты рождения",
  "telNum": "номера телефона",
  "code": "кода",
  "autoMonth": "парковки",
  "remain": "разовых тренировок",
  "days": "срока контракта",
  "notes": "заметок",
  "photoId": "фото",
  "rent": "аренды",
  "deposite": "депозита"
};


export default App;