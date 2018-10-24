"use strict";

const mongoose = require("mongoose");

let trainingFactorSchema = mongoose.Schema({
  user: { type: String, required: true },
  name: { type: String, required: true }
});

trainingFactorSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name
  };
};

const TrainingFactor = mongoose.model("TrainingFactor", trainingFactorSchema);

module.exports = { TrainingFactor, trainingFactorSchema };
