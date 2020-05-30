/* eslint-disable consistent-return */
/* eslint-disable no-console */
// TODO try to move loading to components => if i change date in main page => just components load => and not all at once

const express = require("express");
const history = require("connect-history-api-fallback");
const helmet = require("helmet");
const path = require("path");
const format = require("date-fns/format")
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require('knex');
const open = require('open');
const multer = require('multer');
const host = require("./host");

const staticFiles = express.static(path.join(__dirname, "dist"));


let homePath = null;
process.platform === "win32"
  ? (homePath = path.join(path.dirname(require("os").homedir()), "Public"))
  : (homePath = require("os").homedir());


const personDb = knex({
  client: 'sqlite3',
  connection: { filename: path.join(homePath, "db", "personDATA.db") },
  useNullAsDefault: true
});


const activityDb = knex({
  client: 'sqlite3',
  connection: { filename: path.join(homePath, "db", "activityData.db") },
  useNullAsDefault: true
});


const dayDb = knex({
  client: 'sqlite3',
  connection: { filename: path.join(homePath, "db", "dayData.db") },
  useNullAsDefault: true
});


function writeData(pathTo, dbName) {
  const source = path.join(homePath, "db", dbName);
  fs.copyFile(source, path.join(pathTo, dbName), (err) => {
    if (err) throw err;
    console.log(`${dbName} was copied to ${pathTo}`);
  });
}


(function DbCopy() {
  const datePath = format(new Date(), "ddMMyyyy");
  const pathTo = path.join(homePath, "db", "copyData", datePath);
  if (fs.existsSync(pathTo)) {
    console.log('Database already copied today');
  } else {
    fs.mkdir(pathTo, function error(err) {
      if (err) {
        return console.error(err);
      }
      writeData(pathTo, "personDATA.db");
      writeData(pathTo, "activityDATA.db");
      writeData(pathTo, "dayDATA.db");
    });
  }
})();


const app = express();
app.use(bodyParser.json());
app.use(cors());


/* ************************* API************************* */

app.get("/deleteProfile/:code", (req, res) => {
  const { code } = req.params;
  const codeCyrillic = decodeURI(code);
  personDb('personData')
    .where('code', codeCyrillic)
    .del().then(() =>
      activityDb.select('*').from('activityData').where("code", codeCyrillic).del()
        .then(() => {
          res.send('success');
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
  // http://:6700/getDate/05-04-2020
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

// Get  activities for day history
app.get("/getVisits/:date", (req, res) => {
  // http://:6700/getHistory/05-04-2020
  const { date } = req.params;
  activityDb.select('*').from('activityData').where({ 'date': date, 'type': 'Посещение' }).then(data => {
    res.send(JSON.stringify(data));
  });
});


// Add new profile to day history
app.post("/addToVisits", (req, res) => {
  /* {
   "code": "Иванов123",
   "day": "05-04-2020",
   "time": "12:01:11",
   "amount":""
  } */
  const { code, date, time, amount } = req.body;
  activityDb('activityData')
    .insert({ "code": code, "date": date, "time": time, "type": "Посещение", "person": "", "amount": amount })
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
  activityDb('activityData')
    .where({ "code": code, "date": date, "time": time, "type": type, "person": person, "amount": amount })
    .del()
    .then(() =>
      activityDb.select('*').from('activityData').where("code", code).then(data => {
        res.send(JSON.stringify(data));
      }))
});


const storage = multer.diskStorage({
  destination: path.join("dist", "images"),
  filename(req, file, cb) {
    cb(null, req.params.code + path.extname(file.originalname))
  }
});
const upload = multer({ storage })


app.post('/upload/:code', upload.single('img'), (req, res) => {
  const { code } = req.params;
  // add to all persons db
  personDb('personData')
    .where('code', code)
    .update("photoId", req.file.filename)
    .then(() => res.send("success"));
});




// FOR RFID SCANNER
app.post('/code', (req, res) => {
  const code = (req.body.code).replace("\n", "");
  handleCode(code);
  console.log(req.body.code);
  res.json("success");
})


async function handleCode(code) {
  const todayData = format(new Date(), "dd-MM-yyyy");
  const time = format(new Date(), 'HH:mm:ss');
  const data = await activityDb.select('*').from('activityData').where({ 'code': code, 'date': todayData, 'type': 'Посещение' });
  let amount = "";

  if (!data.length) {
    // find if in persons
    const profiles = await personDb('personData').where('code', code).select('*');
    if (profiles.length && Number.isInteger(profiles[0].remain)) {
      const newRemain = (+profiles[0].remain - 1);
      amount = `УЧЁТ ${profiles[0].remain} => ${newRemain}`;
      await personDb('personData').where('code', code).update("remain", newRemain);
    }
    if (!profiles.length) {
      await personDb('personData').insert({ "personName": code, "code": code });
    }
    await activityDb('activityData')
      .insert({ "code": code, "date": todayData, "time": time, "type": "Посещение", "person": "", "amount": amount });
  }
}

// app.use(helmet());
// app.use(helmet.noCache());
app.use(staticFiles);
app.use(history());

const port = 6700;

// open browser
(async () => {
  await open(`http://${host}:${port}/`);
})();

app.listen(port, host);
app.use(staticFiles)
console.log(`App is listening on port ${port}`);