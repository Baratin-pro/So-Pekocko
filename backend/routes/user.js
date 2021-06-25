"use strict";
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.js");
const rateLimit = require("../middleware/rateLimit.js");

router.post("/signup", userCtrl.signup);
router.post("/login", rateLimit.limiter, userCtrl.login);

module.exports = router;
