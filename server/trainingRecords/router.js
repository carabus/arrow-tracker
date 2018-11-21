("use strict");
const express = require("express");
const bodyParser = require("body-parser");

const { router: authRouter, localStrategy, jwtStrategy } = require("../auth");
const passport = require("passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate("jwt", { session: false });

const { TrainingRecord } = require("./models");
const { TrainingFactor } = require("../trainingFactors/models");

const router = express.Router();

const jsonParser = bodyParser.json();

// Post to create new Training Factor
router.post("/", [jwtAuth, jsonParser], (req, res) => {
  // trim and normalize training factor values
  let normalizedTrainingFactors = [];
  if (req.body.trainingFactors) {
    normalizedTrainingFactors = req.body.trainingFactors.map(factor =>
      factor.trim().toLowerCase()
    );
  }

  return TrainingFactor.insertMany(
    normalizedTrainingFactors.map(factor => ({
      user: req.user.username,
      name: factor
    }))
  )
    .then(factor => {
      let trainingRecord = new TrainingRecord();
      trainingRecord.user = req.user.username;
      trainingRecord.distance = req.body.distance;
      trainingRecord.distanceUnits = req.body.distanceUnits;
      trainingRecord.targetType = req.body.targetType;
      trainingRecord.score = 0;
      trainingRecord.maxScore = 0;
      trainingRecord.ends = [];
      trainingRecord.trainingFactors = [...normalizedTrainingFactors];
      // get units independent distance
      trainingRecord.rankingDistance = getRankingDistance(
        req.body.distance,
        req.body.distanceUnits
      );
      return trainingRecord.save();
    })
    .then(newRecord => {
      res.status(201).json(newRecord.serialize());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

function getRankingDistance(distance, units) {
  if (units === "meters") return distance;
  return Math.round(distance * 0.9144);
}

router.put("/:id", [jwtAuth, jsonParser], (req, res) => {
  // trim and normalize training factor values
  let normalizedTrainingFactors = [];
  if (req.body.trainingFactors) {
    normalizedTrainingFactors = req.body.trainingFactors.map(factor =>
      factor.trim().toLowerCase()
    );
  }

  const updated = {};
  updated["trainingFactors"] = normalizedTrainingFactors;
  const updateableFields = ["distance", "distanceUnits", "ends"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  if ("distance" in req.body || "distanceUnits" in req.body) {
    updated["rankingDistance"] = getRankingDistance(
      req.body.distance,
      req.body.distanceUnits
    );
  }

  return (
    TrainingFactor.insertMany(
      normalizedTrainingFactors.map(factor => ({
        user: req.user.username,
        name: factor
      }))
    )
      .then(factor => {
        return TrainingRecord.findByIdAndUpdate(
          req.params.id,
          { $set: updated },
          { new: true }
        );
      })
      // calculate current and maximum session score
      .then(updatedRecord => {
        let sessionScore = 0;
        let maxSessionScore = 0;
        let chart = [];
        updatedRecord.ends.forEach((end, index) => {
          let endScore = 0;

          end.arrows.forEach(arrow => {
            endScore += arrow.score;
          });
          maxSessionScore += end.arrows.length * 10;
          sessionScore += endScore;
          chart.push({ name: `#${index + 1}`, score: endScore });
        });
        if (!maxSessionScore) maxSessionScore = 10;
        return TrainingRecord.findByIdAndUpdate(
          updatedRecord.id,
          {
            $set: {
              score: sessionScore,
              maxScore: maxSessionScore,
              chart: chart
            }
          },
          { new: true }
        );
      })
      .then(updatedRecord => {
        res.status(200).json(updatedRecord.serialize());
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ code: 500, message: "Internal server error" });
      })
  );
});

// Get training record by id
router.get("/:id", jwtAuth, (req, res) => {
  return TrainingRecord.findById(req.params.id)
    .then(record =>
      res.json(!record ? { message: "not found" } : record.serialize())
    )
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Delete training record by id
router.delete("/:id", jwtAuth, (req, res) => {
  return TrainingRecord.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Get latest training Records for a user
router.get("/", jwtAuth, (req, res) => {
  return TrainingRecord.find({ user: req.user.username })
    .sort({ created: -1 })
    .limit(10)
    .then(records => {
      res.json(records.map(record => record.serialize()));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

module.exports = { router };
