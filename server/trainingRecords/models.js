"use strict";

const mongoose = require("mongoose");

let trainingRecordSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    distance: { type: Number, required: true },
    distanceUnits: { type: String, required: true },
    targetType: { type: String, required: false },
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 0 },
    ends: [
      {
        arrows: [
          {
            coordinates: {
              x: Number,
              y: Number
            },
            score: Number,
            isBullseye: Boolean
          }
        ]
      }
    ],
    trainingFactors: [String],
    chart: [{ name: String, score: Number }],
    rankingDistance: { type: Number }
  },

  { timestamps: { createdAt: "created" } }
);

trainingRecordSchema.methods.serialize = function() {
  return {
    id: this._id,
    distance: this.distance,
    distanceUnits: this.distanceUnits,
    targetType: this.targetType,
    trainingFactors: this.trainingFactors,
    score: this.score,
    maxScore: this.maxScore,
    ends: this.ends,
    chart: this.chart,
    rankingDistance: this.rankingDistance,
    created: this.created
  };
};

const TrainingRecord = mongoose.model("TrainingRecord", trainingRecordSchema);

module.exports = { TrainingRecord };
