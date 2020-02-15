/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const history = require('connect-history-api-fallback');
const expressStaticGzip = require('express-static-gzip');
const helmet = require('helmet');
const path = require("path");

const port = process.env.PORT || 6969;
// const staticFiles = express.static(path.join(__dirname, "dist"));
const staticFiles = expressStaticGzip(path.join(__dirname, "dist"));

const app = express();
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
    }
}));
app.use(helmet.noCache());
app.use(staticFiles);
app.use(history());
app.listen(port);
app.use(staticFiles)
