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
  const normalizedTrainingFactors = req.body.trainingFactors.map(factor =>
    factor.trim().toLowerCase()
  );

  let createTrainingRecord = function() {
    let trainingRecord = new TrainingRecord();
    trainingRecord.user = req.user.id;
    trainingRecord.distance = req.body.distance;
    trainingRecord.distanceUnits = req.body.distanceUnits;
    trainingRecord.score = 0;
    trainingRecord.maxScore = 0;
    trainingRecord.ends = [];
    trainingRecord.trainingFactors = [...normalizedTrainingFactors];
    return trainingRecord.save();
  };

  let createTrainingFactor = createTrainingRecord().then(trainingRecord => {
    return TrainingFactor.insertMany(
      normalizedTrainingFactors.map(factor => ({
        user: req.user.id,
        name: factor
      }))
    );
  });

  return Promise.all([createTrainingRecord(), createTrainingFactor])
    .then(([trainingRecord, trainingFactors]) => {
      return res.status(201).json(trainingRecord.serialize());
    })
    .catch(err => {
      console.log(err);
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === "ValidationError") {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
});

router.put("/:id", [jwtAuth, jsonParser], (req, res) => {
  // trim and normalize training factor values
  const normalizedTrainingFactors = req.body.trainingFactors.map(factor =>
    factor.trim().toLowerCase()
  );

  const updated = {};
  updated["trainingFactors"] = normalizedTrainingFactors;
  const updateableFields = ["distance", "distanceUnits", "ends"];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  return TrainingFactor.insertMany(
    normalizedTrainingFactors.map(factor => ({
      user: req.user.id,
      name: factor.name
    }))
  )
    .then(factor => {
      return TrainingRecord.findByIdAndUpdate(
        req.params.id,
        { $set: updated },
        { new: true }
      );
    })
    .then(updatedRecord => {
      return res.status(200).json(updatedRecord.serialize());
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ code: 500, message: "Internal server error" });
    });
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

module.exports = { router };
