"use strict";

const mongoose = require("mongoose");

let userRankSchema = mongoose.Schema(
  {
    user: { type: String, required: true, unique: true },
    rank: { type: Number, required: true }
  },
  { timestamps: { updatedAt: "updatedAt" } }
);

userRankSchema.methods.serialize = function() {
  return {
    id: this._id,
    rank: this.rank,
    user: this.user,
    updatedAt: this.updatedAt
  };
};

const Rank = mongoose.model("Rank", userRankSchema);

module.exports = { Rank };
