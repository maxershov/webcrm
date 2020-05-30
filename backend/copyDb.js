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
    const pathTo = path.join(homePath, "db", "copyData", datePath);
    if (fs.existsSync(pathTo)) {
        console.log('Database already copied today');
    } else {
        // eslint-disable-next-line consistent-return
        fs.mkdir(pathTo,(err) => {
            if (err) {
                return console.error(err);
            };
            writeData(path.join(pathTo, "personDATA.db"), path.join(homePath, "db", "personDATA.db"));
            writeData(path.join(pathTo, "activityDATA.db"), path.join(homePath, "db", "activityDATA.db"));
            writeData(path.join(pathTo, "dayDATA.db"), path.join(homePath, "db", "dayDATA.db"));
        });
    }
};

module.exports = CopyDatabase;