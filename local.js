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

// app.use(helmet());
// app.use(helmet.noCache());

// app.use(staticFiles);
// app.use(history());

const port = 6700;
app.listen(port, myLocalHost.host);

// app.use(staticFiles)
console.log(`App is listening on port ${port}`);
