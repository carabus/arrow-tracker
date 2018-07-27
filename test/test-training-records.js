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

describe("api/trainingRecords", function() {
  let USERS = [];

  const trainingRecord = {
    distance: 20,
    distanceUnits: "meters"
  };

  const trainingRecordFactors = {
    distance: 20,
    distanceUnits: "meters",
    trainingFactors: ["barebow", "outside"]
  };

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return createUser("user1").then(() => createUser("user2"));
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

  describe("CREATE", function() {
    it("Should create Training Record without additional factors", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set("authorization", `Bearer ${USERS["user1"].token}`)

        .then(res => {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "id",
            "distance",
            "distanceUnits",
            "trainingFactors",
            "score",
            "maxScore",
            "ends",
            "chart",
            "created"
          );
          expect(res.body.id).to.not.be.null;
          return TrainingRecord.findById(res.body.id);
        })
        .then(_trainingRecord => {
          expect(_trainingRecord.distance).to.equal(trainingRecord.distance);
          expect(_trainingRecord.distanceUnits).to.equal(
            trainingRecord.distanceUnits
          );
          expect(_trainingRecord.user).to.equal("user1");
          expect(_trainingRecord.ends).to.have.length(0);
          expect(_trainingRecord.trainingFactors).to.have.length(0);
          expect(_trainingRecord.chart).to.have.length(0);
          expect(_trainingRecord.score).to.equal(0);
          expect(_trainingRecord.maxScore).to.equal(0);
        });
    });

    it("Should create Training Record with additional factors", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecordFactors)
        .set("authorization", `Bearer ${USERS["user1"].token}`)

        .then(res => {
          expect(res).to.have.status(201);
          return TrainingRecord.findById(res.body.id);
        })
        .then(_trainingRecord => {
          expect(_trainingRecord.trainingFactors).to.have.length(2);
          expect(_trainingRecord.trainingFactors).to.deep.equal(
            trainingRecordFactors.trainingFactors
          );
        });
    });
  });

  describe("UPDATE", function() {
    it("Should update Training Record", function() {
      return createTrainingRecords("user1", [trainingRecord])
        .then(trainingRecords => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${trainingRecords[0]._id}`)
            .send({
              distance: 50,
              distanceUnits: "yards",
              trainingFactors: ["test factor"]
            })
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a("object");
          expect(res.body).to.include.keys(
            "id",
            "distance",
            "distanceUnits",
            "trainingFactors"
          );
          return TrainingRecord.findById(res.body.id);
        })
        .then(_trainingRecord => {
          expect(_trainingRecord.distance).to.equal(50);
          expect(_trainingRecord.distanceUnits).to.equal("yards");
          expect(_trainingRecord.trainingFactors).to.have.length(1);
          expect(_trainingRecord.trainingFactors).to.deep.equal([
            "test factor"
          ]);
        });
    });
    it("Should generate score, maxScore and chart on update", function() {
      return createTrainingRecords("user1", [trainingRecord])
        .then(trainingRecords => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${trainingRecords[0]._id}`)
            .send({
              ends: [{ arrows: [{ score: 5 }, { score: 6 }] }]
            })
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          return TrainingRecord.findById(res.body.id);
        })
        .then(_trainingRecord => {
          expect(_trainingRecord.ends).to.have.length(1);
          expect(_trainingRecord.ends[0].arrows).to.have.length(2);
          expect(_trainingRecord.score).to.equal(11);
          expect(_trainingRecord.maxScore).to.equal(20);
          expect(_trainingRecord.chart).to.have.length(1);
          expect(_trainingRecord.chart[0].name).to.equal("end1");
          expect(_trainingRecord.chart[0].score).to.equal(11);
        });
    });
  });

  describe("DELETE", function() {
    it("Should delete Training Record", function() {
      return createTrainingRecords("user1", [trainingRecord])
        .then(trainingRecords => {
          return chai
            .request(app)
            .delete(`/api/trainingRecords/${trainingRecords[0]._id}`)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
        })
        .then(() => {
          return TrainingRecord.find({ user: "user1" });
        })
        .then(res => {
          expect(res).to.have.length(0);
        });
    });

    it.skip("Should not delete Training Record that belongs to different user", function() {
      return createTrainingRecords("user2", [trainingRecord])
        .then(trainingRecords => {
          return chai
            .request(app)
            .delete(`/api/trainingRecords/${trainingRecords[0]._id}`)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(400);
        })
        .then(() => {
          return TrainingRecord.find({ user: "user2" });
        })
        .then(res => {
          expect(res).to.have.length(1);
        });
    });
  });

  describe("GET", function() {
    it("Should return empty array initially", function() {
      return chai
        .request(app)
        .get("/api/trainingRecords")
        .set("authorization", `Bearer ${USERS.user1.token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(0);
        });
    });

    it("Should return array of training records for a user", function() {
      return createTrainingRecords("user1", [trainingRecord, trainingRecord])
        .then(() => {
          return createTrainingRecords("user2", [trainingRecord]);
        })
        .then(() => {
          return chai
            .request(app)
            .get("/api/trainingRecords")
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(2);
        });
    });
  });
});
