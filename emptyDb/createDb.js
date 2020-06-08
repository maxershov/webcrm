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
writeData(path.join(homePath, "db", "personData.db"), path.join(__dirname, '../', "emptyDb", "db", "personData.db"));
writeData(path.join(homePath, "db", "activityData.db"), path.join(__dirname, '../', "emptyDb", "db", "activityData.db"));
writeData(path.join(homePath, "db", "dayData.db"), path.join(__dirname, '../', "emptyDb", "db", "dayData.db"));