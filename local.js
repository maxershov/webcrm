/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */


// TODO try to move loading to components => if i change date in main page => just components load => and not all at once
// TODO check for func => where i need to return new data (add new profile => route.push => fetchData)
// TODO handle visit with remain
// TODO handle code scanner

const express = require("express");
const history = require("connect-history-api-fallback");
const helmet = require("helmet");
const path = require("path");
const format = require("date-fns/format")
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require('knex')
const myLocalHost = require("./host");


const staticFiles = express.static(path.join(__dirname, "dist"));


let homePath = null;
process.platform === "win32"
  ? (homePath = path.join(path.dirname(require("os").homedir()), "Public"))
  : (homePath = require("os").homedir());


const personDb = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(homePath, "db", "personDATA.db")
  },
  useNullAsDefault: true
});


const activityDb = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(homePath, "db", "activityData.db")
  },
  useNullAsDefault: true
});


const dayDb = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(homePath, "db", "dayData.db")
  },
  useNullAsDefault: true
});


const pathPersonData = path.join(homePath, "db", "personDATA.json");


// function writeData(pathTo, data) {
//   fs.writeFile(pathTo, JSON.stringify(data), function (err) {
//     if (err) throw err;
//   })
// }

// checkIfDir();
// function checkIfDir() {
//   const datePath = format(new Date(), "ddMMyyyy");
//   const pathTo = path.join(homePath, "db", "copyData", datePath);
//   if (fs.existsSync(pathTo)) {
//     console.log('The path exists.');
//   } else {
//     fs.mkdir(pathTo, function (err) {
//       if (err) {
//         return console.error(err);
//       }
//       writeData(pathTo + "/personDATA.json", JSON.parse(readDataJSON(pathPersonData)));
//       writeData(pathTo + "/activityDATA.json", JSON.parse(readDataJSON(pathActivitiesData)));
//       writeData(pathTo + "/dayDATA.json", JSON.parse(readDataJSON(pathDayData)));
//       console.log("Directory created successfully!"); //Create dir in case not found
//     });
//   }
// }






const app = express();
app.use(bodyParser.json());
app.use(cors());

/* ************************* API************************* */

app.get("/deleteProfile/:code", (req, res) => {
  const { code } = req.params;
  const codeCyrillic = decodeURI(code);
  console.log('DELETE', codeCyrillic);
  personDb('personData')
    .where('code', codeCyrillic)
    .del().then(() =>
      activityDb.select('*').from('activityData').where("code", codeCyrillic).del()
        .then(() => {
          res.send('sucess');
        }
        ));
});


app.post("/updateCode", (req, res) => {
  // {
  //   "oldCode":"code12345",
  //   "code":"code3"
  // }
  let { oldCode, code } = req.body;
  code = code.replace(/ /g, '');

  personDb('personData')
    .where('code', oldCode)
    .update('code', code)
    .then(() =>
      personDb('personData').where('code', code).select('*')
        .then(data => res.send(JSON.stringify(data))));
});


app.post("/updateField", async (req, res) => {
  console.log(req.body);
  // console.log(req.json());
  const { code, type, value } = req.body;
  personDb('personData')
    .where('code', code)
    .update(type, value)
    .then(() =>
      personDb('personData').where('code', code).select('*'))
    .then(data => res.send(JSON.stringify(data)));
});


app.get("/getPersons", (req, res) => {
  personDb.select('*').from('personData').then(data => {
    res.send(JSON.stringify(data));
  });
});

app.get("/getProfile/:code", (req, res) => {
  const { code } = req.params;
  const codeCyrillic = decodeURI(code);
  personDb('personData')
    .where('code', codeCyrillic)
    .select('*')
    .then(data => {
      res.send(JSON.stringify(data));
    });
});


app.get("/addNewPerson/:code", async (req, res) => {
  let { code } = req.params;
  let nameCyrillic = decodeURI(code);
  code = nameCyrillic.replace(/ /g, '');
  // if code already in base => insert with "КОПИЯ" => users can have same names or its just error
  try {
    await personDb('personData').insert({ "personName": nameCyrillic, "code": code });
  } catch {
    nameCyrillic += ' Копия';
    code += 'Копия';
    await personDb('personData').insert({ "personName": nameCyrillic, "code": code });
  }
  const newUser = await personDb('personData').where('code', code);
  await res.send(JSON.stringify(newUser));
});




/** ********************** DAY ********************************************** */

app.get("/getDate/:day", (req, res) => {
  // http://192.168.1.150:6700/getDate/05-04-2020
  const { day } = req.params;
  dayDb.raw(dayDb('dayData').insert({ "date": day }).toString().replace('insert', 'INSERT OR IGNORE'))
    .then(() => dayDb.select('*').from('dayData').where('date', day).then(data => {
      res.send(JSON.stringify(data));
    }));
});


app.post("/chgNotes", (req, res) => {
  // {
  //   "day": "05-04-2020",
  //   "notes": "aaaaaa"
  // }
  const { day, notes } = req.body;
  dayDb('dayData')
    .where('date', day)
    .update({ 'notes': notes })
    .then(() =>
      dayDb.select('*').from('dayData').where('date', day).then(data => {
        res.send(JSON.stringify(data));
      }))
});




/** ********************** ACTIVITY ********************************************** */


// Get  activ for day history
app.get("/getVisits/:date", (req, res) => {
  // http://192.168.1.150:6700/getHistory/05-04-2020
  const { date } = req.params;
  activityDb.select('*').from('activityData').where({ 'date': date, 'type': 'Посещение' }).then(data => {
    res.send(JSON.stringify(data));
  });
});


// Add new profile to day history
app.post("/addToHistory", (req, res) => {
  /* {
   "code": "Иванов123",
   "day": "05-04-2020",
   "time": "12:01:11"
  } */
  const { code, date, time } = req.body;
  activityDb('activityData')
    .insert({ "code": code, "date": date, "time": time, "type": "Посещение", "person": "", "amount": "" })
    .then(() =>
      activityDb.select('*').from('activityData').where({ "date": date, "type": "Посещение" }).then(data => {
        res.send(JSON.stringify(data));
      }))
});



app.post("/changeActivityCode", (req, res) => {
  /* Get old and new code => add new activity to history about change
  ** Change all codes in activities db 
  ** Return all activities for one user 
  */

  /* {
    "code":"ЕршовМаксимЛеонидович",
    "oldCode": "ааабвгд"
  } */
  const { oldCode, code } = req.body;
  console.log(oldCode, code);
  activityDb('activityData')
    .insert({ "code": code, "date": format(new Date(), 'dd-MM-yyyy'), "time": format(new Date(), 'HH:mm:ss'), "type": "Изменение кода", "amount": `${oldCode}=>${code}` })
    .then(() =>
      activityDb.select('*')
        .from('activityData')
        .where("code", oldCode)
        .update({ 'code': code })
        .then(() =>
          activityDb.select('*').from('activityData').where("code", code).then(data => {
            res.send(JSON.stringify(data));
          })));
});


// get activities by code
app.get("/getActivities/:code", (req, res) => {
  // http://192.168.1.150:6700/getActivities/ЕршовМаксимЛеонидович
  const { code } = req.params;
  const codeCyrillic = decodeURI(code);
  activityDb.select('*').from('activityData').where("code", codeCyrillic).then(data => {
    res.send(JSON.stringify(data));
  });
});


// add activity by code
app.post("/addActivity", (req, res) => {
  /* {
   "code": "ЕршовМаксимЛеонидович",
   "day": "05-04-2020",
   "time": "10:01:11",
   "type": "ПТ",
   "person": "",
   "amount": ""
  } */
  const { code, date, time = '00:00:00', type = '', person = '', amount = '' } = req.body;
  activityDb('activityData')
    .insert({ "code": code, "date": date, "time": time, "type": type, "person": person, "amount": amount })
    .then(() =>
      activityDb.select('*').from('activityData').where("code", code).then(data => {
        res.send(JSON.stringify(data));
      }))
});


// del activity by code. date, time
app.post("/delActivity", (req, res) => {
  /* {
   "code": "ЕршовМаксимЛеонидович",
   "day": "05-04-2020",
   "time": "10:01:11",
   "type": "ПТ",
   "person": "",
   "amount": ""
  } */
  const { code, date, time, type, person, amount } = req.body;
  console.log('code, date, time, type, person, amount');
  console.log(code, date, time, type, person, amount);
  activityDb('activityData')
    .where({ "code": code, "date": date, "time": time, "type": type, "person": person, "amount": amount })
    .del()
    .then(() =>
      activityDb.select('*').from('activityData').where("code", code).then(data => {
        res.send(JSON.stringify(data));
      }))
});



// FOR RFID SCANNER


app.post('/code', (req, res) => {
  const code = (req.body.code).replace("\n", "");
  handleCode(code);
  console.log(req.body.code);
  res.json("sucess");
})
/*

function handleCode(code) {
  const todayData = format(new Date(), "dd-MM-yyyy");
  const dayData = JSON.parse(readDataJSON(pathDayData));
  let indexDate = dayData.findIndex(x => x.date === todayData);


  // TODO create new date obj if indexData === -1
  if (indexDate === -1) {
    console.log('Create new day in Db')
    const newDateObj = { date: todayData, notes: "", history: [] };
    dayData.push(newDateObj);
    indexDate = dayData.length - 1;
    console.log("length", indexDate);
    console.log(dayData.findIndex(x => x.date === todayData));
  }


  // find if person already in history
  const index = dayData[indexDate].history.findIndex(x => x.code === code);
  if (index === -1) {
    const codeObj = { "code": code, "time": format(new Date(), 'HH:mm:ss') };
    dayData[indexDate].history.push(codeObj)

    // writeData(pathDayData, dayData);
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

    pushNewActivity(personData[personIndex].code, activityObj);

    writeData(pathPersonData, personData);
  } else {
    const visitObj = { "code": personData[personIndex].code, "activity": [{ "date": format(new Date(), 'dd-MM-yyyy'), "time": format(new Date(), 'HH:mm:ss'), "type": "Посещение", "person": "", "amount": "" }] };
    pushNewActivity(personData[personIndex].code, visitObj);
  }
}

function pushNewActivity(code, activityObj) {
  const activitiesData = JSON.parse(readDataJSON(pathActivitiesData));
  const activitiesIndex = activitiesData.findIndex(x => x.code === code);
  activitiesData[activitiesIndex].activity.push(activityObj);

  writeData(pathActivitiesData, activitiesData);
}

function createNewPerson(code) {
  const personData = JSON.parse(readDataJSON(pathPersonData));
  const newPerson = { "personName": code, "contract": "", "dateBirth": "", "telNum": "", "code": code, "autoMonth": "", "notes": "", "remain": "", "days": "", "photoId": 0, "rent": "", "deposite": "", };
  personData.push(newPerson);

  writeData(pathPersonData, personData);


  const activitiesObj = { "code": code, "activity": [{ "date": format(new Date(), 'dd-MM-yyyy'), "time": format(new Date(), 'HH:mm:ss'), "type": "Создание профиля", "person": "", "amount": "" }] };
  const activitiesData = JSON.parse(readDataJSON(pathActivitiesData));
  activitiesData.push(activitiesObj);

  writeData(pathActivitiesData, activitiesData);
}
*/

// app.use(helmet());
// app.use(helmet.noCache());


app.use(staticFiles);
app.use(history());

const port = 6700;
app.listen(port, myLocalHost.host);

app.use(staticFiles)


console.log(`App is listening on port ${port}`);