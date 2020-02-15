/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const history = require('connect-history-api-fallback');
const expressStaticGzip = require('express-static-gzip');
const helmet = require('helmet');
const path = require("path");
const fs = require('fs');
const myLocalHost = require("./host");




let homePath = null;
process.platform === 'win32' ? homePath = path.join(path.dirname((require('os')).homedir()), 'Public') : homePath = (require('os')).homedir();

const pathPersonData = path.join(homePath, 'db', 'personDATA.json');
const pathDayData = path.join(homePath, 'db', 'dayDATA.json');
const pathActivitiesData = path.join(homePath, 'db', 'activityDATA.json');

function readDataJSON(pathTo) {
    const bitArray = fs.readFileSync(pathTo);
    return JSON.stringify(JSON.parse(bitArray));
}


const personDataString = readDataJSON(pathPersonData);

const dayDataString = readDataJSON(pathDayData);

const activityDataString = readDataJSON(pathActivitiesData)



// const staticFiles = express.static(path.join(__dirname, "dist"));
const staticFiles = expressStaticGzip(path.join(__dirname, "dist"));

const app = express();

app.get('/getData', (req, res) => {
    res.send(personDataString)
})


app.use(helmet());
app.use(helmet.noCache());
app.use(staticFiles);
app.use(history());
const port = 6969;
app.listen(port, myLocalHost.host);
app.use(staticFiles)
console.log(`App is listening on port ${port}`);
