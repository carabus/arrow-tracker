"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { TrainingRecord } = require("../trainingRecords");
const { TrainingFactor } = require("../trainingFactors");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("api/trainingFactors", function() {
  let USERS = [];

  const trainingRecord = {
    distance: 20,
    distanceUnits: "meters"
  };

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return createUser("user1");
  });

  function createUser(username) {
    return User.hashPassword(username)
      .then(hash => {
        return User.create({ username, password: hash });
      })
      .then(function() {
        return getValidToken(username);
      });
  }

  function getValidToken(username) {
    return chai
      .request(app)
      .post("/api/auth/login")
      .send({ username, password: username })
      .then(res => {
        USERS[username] = { token: res.body.authToken };
      });
  }

  function createTrainingRecords(user, trainingRecords) {
    return TrainingRecord.insertMany(
      trainingRecords.map(record => Object.assign({}, record, { user }))
    );
  }

  afterEach(function() {
    return TrainingRecord.remove({}).then(() =>
      User.remove({}).then(() => TrainingFactor.remove({}))
    );
  });

  describe("GET", function() {
    it("Should return array of normalized training factors entered by user with no duplicates user", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(
          Object.assign({}, trainingRecord, {
            trainingFactors: ["Test1", "test2"]
          })
        )
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(() => {
          return chai
            .request(app)
            .post(`/api/trainingRecords/`)
            .send(
              Object.assign({}, trainingRecord, {
                trainingFactors: ["   test1   ", "TEST2"]
              })
            )
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .get("/api/trainingFactors")
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(2);
          expect(res.body).to.deep.equal([
            { id: "test1", name: "test1" },
            { id: "test2", name: "test2" }
          ]);
        });
    });
  });
});
