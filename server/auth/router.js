"use strict";
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const config = require("../config");
const router = express.Router();

const { User } = require("../users/models");

const createAuthToken = function(user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: "HS256"
  });
};

router.use(bodyParser.json());

router.post("/socialLogin", (req, res) => {
  let {
    username,
    password = username,
    firstName = "",
    lastName = ""
  } = req.body;
  return User.find({ username })
    .countDocuments()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        const authToken = createAuthToken({ username });
        res.json({ authToken });
      } else {
        return User.create({
          username,
          password
        }).then(user => {
          const authToken = createAuthToken({ username });
          res.json({ authToken });
        });
      }
    })
    .catch(err =>
      res.status(500).json({ code: 500, message: "Internal server error" })
    );
});

const localAuth = passport.authenticate("local", { session: false });

// The user provides a username and password to login
router.post("/login", localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

const jwtAuth = passport.authenticate("jwt", { session: false });

// The user exchanges a valid JWT for a new one with a later expiration
router.post("/refresh", jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
