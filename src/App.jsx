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
import { getPersonStore } from './store/storeGetters'

const path = require("path");


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

// let imgPath = null;
// process.platform === "win32"
//   ? (imgPath = path.join(path.dirname(require("os").homedir()), "Public",  "db", "images"))
//   : (imgPath = path.join(require("os").homedir(),"db", "images" ));

export function getImg(photoPath) {
  // console.log(imgPath);
  try {
    // return require(`../images/${photoPath}`)
    // return path.join(imgPath, photoPath)
    return `http://192.168.1.150:6700/images/${photoPath}`;
  } catch (err) {
    // return require('../images/0.jpg');
    // return path.join(imgPath, "0.jpg")
    return `http://192.168.1.150:6700/images/0.jpg`;
  }
}
// export function getImg(photoId) {
//   try {
//     return require(`./images/${photoId}.JPG`)
//   } catch (err) {
//     try {
//       return require(`./images/${photoId}.jpeg`);
//     } catch (err) {
//       try {
//         return require(`./images/${photoId}.jpg`);
//       } catch (err) {
//         return require('./images/0.jpg');
//       }
//     }
//   }
// }


export function getIndexByCode(code) {
  return getPersonStore().findIndex(x => x.code === code);
}


export function getDaysLeft(date) {
  if (date === "") return date;
  return differenceInDays(startOfDay(parse(date, 'dd-MM-yyyy', new Date())), startOfDay(new Date()));
}


export default App;