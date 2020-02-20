/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const history = require("connect-history-api-fallback");
const expressStaticGzip = require("express-static-gzip");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const myLocalHost = require("./host");
const format = require("date-fns/format")



let homePath = null;
process.platform === "win32"
  ? (homePath = path.join(path.dirname(require("os").homedir()), "Public"))
  : (homePath = require("os").homedir());

const pathPersonData = path.join(homePath, "db", "personDATA.json");
const pathDayData = path.join(homePath, "db", "dayDATA.json");
const pathActivitiesData = path.join(homePath, "db", "activityDATA.json");

function readDataJSON(pathTo) {
  const bitArray = fs.readFileSync(pathTo);
  return JSON.stringify(JSON.parse(bitArray));
}

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/getperson", (req, res) => {
  const personDataString = readDataJSON(pathPersonData);
  res.send(personDataString);
});

app.get("/getday", (req, res) => {
  const dayDataString = readDataJSON(pathDayData);
  console.log('getdayFirst', dayDataString);
  res.send(dayDataString);
});

app.get("/getactivity", (req, res) => {
  const activityDataString = readDataJSON(pathActivitiesData);
  res.send(activityDataString);
});

// app.post("change", (req, res) => {
//   const { type, value } = req.body;
//   console.log(type, value);
//   res.json("sucess");
// });

app.post("/changepersons", (req, res) => {
  // console.log("changepersons in local");
  const { data } = req.body;
  // console.log(data);

  fs.writeFile(pathPersonData, JSON.stringify(data), function (err) {
    if (err) throw err;
  })
  res.json("sucess");
});

app.post("/changeactivities", (req, res) => {
  // console.log("changeactivities in local");
  const { data } = req.body;
  // console.log(data);

  fs.writeFile(pathActivitiesData, JSON.stringify(data), function (err) {
    if (err) throw err;
  })
  res.json("sucess");
});

app.post("/changeday", (req, res) => {
  console.log("changeday in local");
  const { data } = req.body;
  console.log(data);

  fs.writeFile(pathDayData, JSON.stringify(data), function (err) {
    if (err) throw err;
  })
  res.json("sucess");
});





app.post('/code', (req, res) => {
  const todayData = format(new Date(), "dd-MM-yyyy");
  const dayData = JSON.parse(readDataJSON(pathDayData));
  const indexDate = dayData.findIndex(x => x.date === todayData);
  const code = (req.body.code).replace("\n", "");

  const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
  dayData[indexDate].history.push(codeObj)
  fs.writeFile(pathDayData, JSON.stringify(dayData), function (err) {
    if (err) throw err;
  })
  console.log(req.body.code);
  // res.json("sucess");
  res.json('ht');
})

// app.use(helmet());
// app.use(helmet.noCache());

// app.use(staticFiles);
// app.use(history());

const port = 6700;
app.listen(port, myLocalHost.host);

// app.use(staticFiles)
console.log(`App is listening on port ${port}`);








// function substractOneRemain(code) {
//   const personData = getPersonStore();
//   const index = getIndexByCode(code);
//   const person = personData[index];
//   if (person.remain !== "") ChangeProfileValue(code, (+person.remain - 1), 'remain');
// }


// function addToTodayHistory(code, dayObject) {
//   const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
//   // find if person already in history
//   const index = dayObject.history.findIndex(x => x.code === code);
//   if (index === -1) {
//     dayObject.history.push(codeObj);
//     substractOneRemain(code);
//   }
//   addNewDayDataToJSON(dayObject);
// }


// function handleNewCode(code, dayObject) {
//   const personData = getPersonStore();
//   const index = personData.findIndex(person => person.code === code);
//   // TODO find if already in history..

//   // If code not in db => create new + add to history. If already in db => add to history 
//   if (index === -1) {
//     addNewPersonToJSON(code, false);
//     addToTodayHistory(code, dayObject);
//   } else {
//     addToTodayHistory(personData[index].code, dayObject);
//   }
// }