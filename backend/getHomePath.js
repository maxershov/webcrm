/* eslint-disable global-require */
const path = require("path");

function getHomePath() {
    if (process.platform === "win32") return path.join(path.dirname(require("os").homedir()), "Public");
    return require("os").homedir();
}

const homePath = getHomePath();

module.exports = homePath;