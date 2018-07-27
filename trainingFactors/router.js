"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { router: authRouter, localStrategy, jwtStrategy } = require("../auth");
const passport = require("passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate("jwt", { session: false });

const { TrainingFactor } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Get all training factors for a user
router.get("/", jwtAuth, (req, res) => {
  return TrainingFactor.distinct("name", { user: req.user.username })
    .then(factors => factors.map(factor => ({ id: factor, name: factor })))
    .then(factors => res.json(factors))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = { router };
