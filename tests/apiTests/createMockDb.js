const path = require('path');
const fs = require('fs');

export function createMockDb() {
    const personDbPath = path.join(__dirname, "db", "personData.db");
    const activityDbPath = path.join(__dirname, "db", "activityData.db");
    const dayDbPath = path.join(__dirname, "db", "dayData.db");
    writeData(path.join(__dirname, "personData.db"), personDbPath);
    writeData(path.join(__dirname, "activityData.db"), activityDbPath);
    writeData(path.join(__dirname, "dayData.db"), dayDbPath);
}

export function deleteMockDb() {
    fs.unlinkSync(path.join(__dirname, "personData.db"));
    fs.unlinkSync(path.join(__dirname, "activityData.db"));
    fs.unlinkSync(path.join(__dirname, "dayData.db"));
}

function writeData(pathTo, sourceFile) {
    fs.copyFile(sourceFile, pathTo, (err) => {
        if (err) throw err;
    });
}