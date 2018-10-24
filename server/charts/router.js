"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { router: authRouter, localStrategy, jwtStrategy } = require("../auth");
const passport = require("passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate("jwt", { session: false });

const { TrainingRecord } = require("../trainingRecords");

const router = express.Router();

const jsonParser = bodyParser.json();

// Progress chart - all user sessions scores in session creation order
router.get("/progress", jwtAuth, (req, res) => {
  // Get average score per session
  return TrainingRecord.find({ user: req.user.username })
    .sort({ created: 1 })
    .then(records => {
      return res.json(
        records.map((record, index) => ({
          session: index + 1,
          score: Math.round((record.score / record.maxScore) * 100)
        }))
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Compare chart - scores of sessions having specified training factors
router.post("/compare", [jwtAuth, jsonParser], (req, res) => {
  // Get sessions with specific training factors
  return TrainingRecord.find(
    {
      user: req.user.username,
      trainingFactors: req.body.selectedFactors
    },
    "created score maxScore"
  )
    .sort({ created: 1 })
    .then(records => {
      res.json(
        records.map((record, index) => ({
          session: index + 1,
          score: Math.round((record.score / record.maxScore) * 100)
        }))
      );
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});
module.exports = { router };
