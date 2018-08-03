"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const { router: authRouter, localStrategy, jwtStrategy } = require("../auth");
const passport = require("passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate("jwt", { session: false });

const { Rank } = require("./models");
const { TrainingRecord } = require("../trainingRecords");

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
      return res.status(500).json({ message: "Internal server error" });
    });
});

// Calculate and persist user rank
router.post("/", jwtAuth, (req, res) => {
  return TrainingRecord.find()
    .then(trainingRecords => {
      const avgRank =
        trainingRecords
          .map(
            trainingRecord =>
              Math.round(
                (trainingRecord.score / trainingRecord.maxScore) * 100
              ) * getDistanceModifier(trainingRecord.rankingDistance)
          )
          .reduce((trainingRecordRank, sumOfRanks) => {
            return sumOfRanks + trainingRecordRank;
          }) / trainingRecords.length;

      return Rank.update(
        { user: req.user.username },
        { $set: { rank: avgRank } },
        { upsert: true, new: true }
      );
    })

    .then(() => {
      res.status(201).json({ message: "success" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// We add additional weight for longer distances, e.g. 0.1 for each 5 meters, starting from 20
function getDistanceModifier(distance) {
  return Math.round((distance - 20) / 5) * 0.1 + 1;
}

module.exports = { router };
