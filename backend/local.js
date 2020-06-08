/* eslint-disable no-console */
const express = require("express");
const history = require("connect-history-api-fallback");
const helmet = require("helmet");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const open = require("open");
const API = require("./api");
const { CopyDatabase } = require("./copyDb");
const homePath = require("./getHomePath");
const dbObj = require("./db");
const ipAddress = require("./findAddress")();

const staticFiles = express.static(path.join(__dirname, '../', "dist"));

CopyDatabase(homePath);

const app = express();
app.use(bodyParser.json());
app.use(cors());

API(app, dbObj);


// app.use(helmet());
app.use(staticFiles);
app.use(history());

const port = 6700;

// open browser
(async () => {
  await open(`http://${ipAddress}:${port}/`);
})();

app.listen(port, ipAddress);



process.on('uncaughtException', function (err) {
  if (err.errno === 'EADDRINUSE') {
    open(`http://${ipAddress}:${port}/`, {wait: true}).then(() => {process.exit(1)});
  } else {
    process.exit(1);
  } 
});

app.use(staticFiles)
console.log(`App is listening on port ${ipAddress} : ${port}`);