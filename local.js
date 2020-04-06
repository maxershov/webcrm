/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
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
  }
});

const activityData = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(homePath, "db", "activityData.db")
  },
  useNullAsDefault: true
});

personDb.select('*').from('personData').then(data => {
  console.log(data);
});



// INSERT INTO "main"."personData"("code","autoMonth","remain","days","rent","deposite") VALUES ('2',NULL,NULL,NULL,NULL,NULL);


const pathPersonData = path.join(homePath, "db", "personDATA.json");
const pathDayData = path.join(homePath, "db", "dayDATA.json");
const pathActivitiesData = path.join(homePath, "db", "activityDATA.json");

function readDataJSON(pathTo) {
  const bitArray = fs.readFileSync(pathTo);
  return JSON.stringify(JSON.parse(bitArray));
}

function writeData(pathTo, data) {
  fs.writeFile(pathTo, JSON.stringify(data), function (err) {
    if (err) throw err;
  })
}


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

app.post("/deletePerson", (req, res) => {
  const { code } = req.body;
  personDb('personData')
    .where('code', code)
    .del().then(res.send('sucess'));
  // TODO handle activities del
});

app.post("/updateCode", (req, res) => {
  // {
  //   "oldCode":"code12345",
  //   "code":"code3"
  // }
  const { oldCode, code } = req.body;
  personDb('personData')
    .where('code', oldCode)
    .update('code', code)
    .then(() =>
      personDb('personData').where('code', code).select('*')
        .then(data => res.send(JSON.stringify(data))));
  // TODO handle activities rename
});

app.post("/updateField", async (req, res) => {
  const { code, type, value } = req.body;
  personDb('personData')
    .where('code', code)
    .update(type, value)
    .then(() =>
      personDb('personData').where('code', code).select('*'))
    .then(data => res.send(JSON.stringify(data)));
});


app.post("/getPersons", (req, res) => {
  personDb.select('*').from('personData').then(data => {
    res.send(JSON.stringify(data));
  });
});


app.post("/addNewPerson", async (req, res) => {
  // {
  //   "personName": "test3",
  //   "code":"code3"
  // }
  let { personName, code } = req.body;

  // if code already in base => insert with "КОПИЯ" => users can have same names or its just error
  try {
    await personDb('personData').insert({ personName, code });
  } catch {
    personName += ' Копия';
    code += ' Копия';
    await personDb('personData').insert({ personName, code });
  }
  const newUser = await personDb('personData').where('code', code);
  await res.send(JSON.stringify(newUser));
});


// personDb('personData').where('code', code)

// app.post("/addNewPerson", async (req, res) => {
//   // TODO handle equal codes
//   const { personName, code } = req.body;
//   console.log(personName, code);
//   await personDb('personData').insert({ personName, code });
//   const newUser = await personDb('personData').where('code', code)
//   console.log(newUser);
//   await res.send(newUser);
// });

// app.post("/addNewPerson", (req, res) => {
//   const { personName, code } = req.body;
//   console.log(personName, code);
//   personDb.raw(personDb('personData').insert({
//     personName,
//     code
//   }).toString().replace('insert', 'INSERT OR IGNORE')).then(
//     res.send('sucess')
//   );
// }); 
// mb res.send => query new row with name and code => if already in list => will take saved profile!










app.get("/getperson", (req, res) => {
  const personDataString = readDataJSON(pathPersonData);
  res.send(personDataString);
});

app.get("/getday", (req, res) => {
  const dayDataString = readDataJSON(pathDayData);
  // console.log('getdayFirst', dayDataString);
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
  writeData(pathPersonData, data);
  res.json("sucess");
});

app.post("/changeactivities", (req, res) => {
  // console.log("changeactivities in local");
  const { data } = req.body;
  // console.log(data);

  writeData(pathActivitiesData, data);
  res.json("sucess");
});

app.post("/changeday", (req, res) => {
  // console.log("changeday in local");
  const { data } = req.body;
  // console.log(data);

  writeData(pathDayData, data);
  res.json("sucess");
});





app.post('/code', (req, res) => {
  const code = (req.body.code).replace("\n", "");
  handleCode(code);
  // console.log(req.body.code);
  res.json("sucess");
})


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

    writeData(pathDayData, dayData);
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


// app.use(helmet());
// app.use(helmet.noCache());


app.use(staticFiles);
app.use(history());

const port = 6700;
app.listen(port, myLocalHost.host);

app.use(staticFiles)


console.log(`App is listening on port ${port}`);