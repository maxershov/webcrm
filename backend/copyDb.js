/* eslint-disable no-console */
const path = require("path");


function writeData(pathTo, dbName) {
    const source = path.join(homePath, "db", dbName);
    fs.copyFile(source, path.join(pathTo, dbName), (err) => {
        if (err) throw err;
        console.log(`${dbName} was copied to ${pathTo}`);
    });
}


export default function DbCopy() {
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
};
