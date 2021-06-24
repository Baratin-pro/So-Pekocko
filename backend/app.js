"use strict";
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

/*
 * Routes API
 */


/*
 * Connection à la BD
 */

/*
 * Cors
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/*
 * Processing request
 */
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(bodyParser.json());
/*
 * Execution
 */

module.exports = app;