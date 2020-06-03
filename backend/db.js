const knex = require('knex');
const path = require("path");

const homePath = require("./getHomePath");


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


module.exports = {personDb, activityDb, dayDb};