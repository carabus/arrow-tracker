"use strict";
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/archery-tracker";
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL || "mongodb://localhost/test-archery-tracker";
exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "https://frozen-springs-98416.herokuapp.com";
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
