"use strict";

const mongoose = require("mongoose");

let trainingRecordSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    distance: Number,
    distanceUnits: String,
    score: Number,
    maxScore: Number,
    ends: [
      {
        arrows: [
          {
            coordinates: {
              x: Number,
              y: Number
            },
            score: Number,
            isInverted: Boolean,
            isBullseye: Boolean
          }
        ]
      }
    ],
    trainingFactors: [String],
    chart: [{ name: String, score: Number }]
  },

  { timestamps: { createdAt: "created" } }
);

trainingRecordSchema.methods.serialize = function() {
  return {
    id: this._id,
    distance: this.distance,
    distanceUnits: this.distanceUnits,
    trainingFactors: this.trainingFactors,
    score: this.score,
    maxScore: this.maxScore,
    ends: this.ends,
    chart: this.chart,
    created: this.created
  };
};

const TrainingRecord = mongoose.model("TrainingRecord", trainingRecordSchema);

module.exports = { TrainingRecord };
