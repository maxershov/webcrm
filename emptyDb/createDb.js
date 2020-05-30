/* eslint-disable no-console */
const path = require("path");
const fs = require("fs");
const homePath = require("../backend/getHomePath");
const { writeData } = require("../backend/copyDb");

const pathTo = path.join(homePath, "db");
fs.mkdir(pathTo, (err) => {
    if (err) {
        return console.error(err);
    };
});
writeData(path.join(homePath, "db", "personDATA.db"), path.join(__dirname, '../', "emptyDb", "db", "personDATA.db"));
writeData(path.join(homePath, "db", "activityDATA.db"), path.join(__dirname, '../', "emptyDb", "db", "activityDATA.db"));
writeData(path.join(homePath, "db", "dayDATA.db"), path.join(__dirname, '../', "emptyDb", "db", "dayDATA.db"));