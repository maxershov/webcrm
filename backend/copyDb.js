/* eslint-disable consistent-return */
/* eslint-disable no-console */
const path = require("path");
const format = require("date-fns/format")
const fs = require("fs");


function writeData(pathTo, sourceFile) {
    fs.copyFile(sourceFile, pathTo, (err) => {
        if (err) throw err;
    });
    console.log(`Db was copied to ${pathTo}`);
}

function CopyDatabase(homePath) {
    const datePath = format(new Date(), "ddMMyyyy");
    const pathToCopyDir = path.join(homePath, "db", "copyData");
    const pathTo = path.join(homePath, "db", "copyData", datePath);
    if (fs.existsSync(pathTo)) {
        console.log('Database already copied today');
    } else {
        if (!fs.existsSync(pathToCopyDir)) fs.mkdir(pathToCopyDir, (err) => {
            if (err) { return console.error(err); };
        })

        fs.mkdir(pathTo, (err) => {
            if (err) { return console.error(err); }
        });
        writeData(path.join(pathTo, "personData.db"), path.join(homePath, "db", "personData.db"));
        writeData(path.join(pathTo, "activityData.db"), path.join(homePath, "db", "activityData.db"));
        writeData(path.join(pathTo, "dayData.db"), path.join(homePath, "db", "dayData.db"));
    }
}

module.exports = { CopyDatabase, writeData }