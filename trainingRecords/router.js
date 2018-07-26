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
      user: req.user.id,
      name: factor
    }))
  )
    .then(factor => {
      let trainingRecord = new TrainingRecord();
      trainingRecord.user = req.user.id;
      trainingRecord.distance = req.body.distance;
      trainingRecord.distanceUnits = req.body.distanceUnits;
      trainingRecord.score = 0;
      trainingRecord.maxScore = 0;
      trainingRecord.ends = [];
      trainingRecord.trainingFactors = [...normalizedTrainingFactors];
      return trainingRecord.save();
    })
    .then(newRecord => {
      return res.status(201).json(newRecord.serialize());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

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

  return (
    TrainingFactor.insertMany(
      normalizedTrainingFactors.map(factor => ({
        user: req.user.id,
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
            sessionScore += arrow.score;
            maxSessionScore += 10;
            endScore += arrow.score;
          });
          chart.push({ name: `end${index + 1}`, score: endScore });
        });
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
        return res.status(200).json(updatedRecord.serialize());
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

// Get all training Records for a user
router.get("/", jwtAuth, (req, res) => {
  return TrainingRecord.find({ user: req.user.id })
    .then(records => res.json(records.map(record => record.serialize())))
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

// Get a page of training Records for a user
router.get("/page/:pageNumber", jwtAuth, async (req, res) => {
  try {
    const page = parseInt(req.params.pageNumber, 10);
    const trainingRecordsCount = await TrainingRecord.countDocuments({
      user: req.user.id
    });
    const pageCount = Math.trunc(trainingRecordsCount / 5) + 1;
    const trainingRecords = await TrainingRecord.find({ user: req.user.id })
      .sort({ created: -1 })
      .skip(page * 5)
      .limit(5);

    return res.json({
      pageCount,
      trainingRecords: trainingRecords.map(record => record.serialize())
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ code: 500, message: "Internal server error" });
  }
});

module.exports = { router };
