"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { router: authRouter, localStrategy, jwtStrategy } = require("../auth");
const passport = require("passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate("jwt", { session: false });

const { Rank } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Get user rank percentile
router.get("/", jwtAuth, (req, res) => {
  return Rank.find()
    .sort({ rank: 1 })
    .then(ranks => {
      const i = ranks.findIndex(rank => rank.user === req.user.username) + 1;
      return (100 * (i - 0.5)) / ranks.length;
    })
    .then(percentile => res.json(percentile))
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = { router };
