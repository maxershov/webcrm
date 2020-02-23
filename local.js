/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const history = require("connect-history-api-fallback");
const expressStaticGzip = require("express-static-gzip");
const helmet = require("helmet");
const path = require("path");
const format = require("date-fns/format")
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const myLocalHost = require("./host");




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
  const code = (req.body.code).replace("\n", "");
  handleCode(code);

  // const todayData = format(new Date(), "dd-MM-yyyy");
  // const dayData = JSON.parse(readDataJSON(pathDayData));
  // const indexDate = dayData.findIndex(x => x.date === todayData);


  // const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
  // dayData[indexDate].history.push(codeObj)
  // fs.writeFile(pathDayData, JSON.stringify(dayData), function (err) {
  //   if (err) throw err;
  // })
  console.log(req.body.code);
  res.json("sucess");
  // res.json('ht');
})


function handleCode(code) {
  const todayData = format(new Date(), "dd-MM-yyyy");
  const dayData = JSON.parse(readDataJSON(pathDayData));
  const indexDate = dayData.findIndex(x => x.date === todayData);
  // find if person already in history
  const index = dayData[indexDate].history.findIndex(x => x.code === code);
  if (index === -1) {
    const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
    dayData[indexDate].history.push(codeObj)
    fs.writeFile(pathDayData, JSON.stringify(dayData), function (err) {
      if (err) throw err;
    })
    checkIfInPersons(code);
  }
}

function checkIfInPersons(code) {
  const personData = JSON.parse(readDataJSON(pathPersonData));
  const personIndex = personData.findIndex(x => x.code === code);
  if (personIndex === -1) {
    createNewPerson(code);
  } else {
    substractOneRemain(personData, personIndex);
  }
}

function substractOneRemain(personData, personIndex) {
  if (personData[personIndex].remain !== "") {
    const oldFieldValue = personData[personIndex].remain;
    personData[personIndex].remain = +oldFieldValue - 1;
    const time = format(new Date(), 'HH:mm:ss');
    const date = format(new Date(), 'dd-MM-yyyy')

    const activityObj = { "date": date, "time": time, "type": `Изменение тренировок`, "person": "", "amount": `${oldFieldValue} => ${personData[personIndex].remain}` };

    pushNewActivity(personData[personIndex].code, JSON.stringify(activityObj));

    fs.writeFile(pathPersonData, JSON.stringify(personData), function (err) {
      if (err) throw err;
    })
  }
}

function pushNewActivity(code, activityObj) {
  const activitiesData = JSON.parse(readDataJSON(pathActivitiesData));
  const activitiesIndex = activitiesData.findIndex(x => x.code === code);
  activitiesData[activitiesIndex].activity.push(activityObj);
  fs.writeFile(pathActivitiesData, JSON.stringify(activitiesData), function (err) {
    if (err) throw err;
  })
}

function createNewPerson(code) {
  const personData = JSON.parse(readDataJSON(pathPersonData));
  const newPerson = { "personName": code, "contract": "", "dateBirth": "", "telNum": "", "code": code, "autoMonth": "", "notes": "", "remain": "", "days": "", "photoId": 0, "rent": "", "deposite": "", };
  personData.push(newPerson);
  fs.writeFile(pathPersonData, JSON.stringify(personData), function (err) {
    if (err) throw err;
  })
  const activitiesObj = { "code": code, "activity": [{ "date": format(new Date(), 'dd-MM-yyyy'), "time": format(new Date(), 'HH:mm:ss'), "type": "Создание профиля", "person": "", "amount": "" }] };
  const activitiesData = JSON.parse(readDataJSON(pathActivitiesData));
  activitiesData.push(activitiesObj);
  fs.writeFile(pathActivitiesData, JSON.stringify(activitiesData), function (err) {
    if (err) throw err;
  })
}


// app.use(helmet());
// app.use(helmet.noCache());

// app.use(staticFiles);
// app.use(history());

const port = 6700;
app.listen(port, myLocalHost.host);

// app.use(staticFiles)
console.log(`App is listening on port ${port}`);