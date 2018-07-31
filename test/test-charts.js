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

describe("api/charts/progress", function() {
  let USERS = [];

  const trainingRecord = {
    distance: 20,
    distanceUnits: "meters",
    ends: [
      {
        arrows: [
          {
            score: 9
          },
          {
            score: 8
          },
          {
            score: 7
          }
        ]
      },
      {
        arrows: [
          {
            score: 10
          },
          {
            score: 0
          },
          {
            score: 9
          }
        ]
      }
    ],
    trainingFactors: ["outside"]
  };

  const trainingRecord2 = {
    distance: 30,
    distanceUnits: "meters",
    ends: [
      {
        arrows: [
          {
            score: 8
          },
          {
            score: 8
          },
          {
            score: 8
          }
        ]
      }
    ]
  };

  const trainingRecordFactors = {
    distance: 30,
    distanceUnits: "meters",
    ends: [
      {
        arrows: [
          {
            score: 7
          },
          {
            score: 7
          },
          {
            score: 7
          }
        ]
      }
    ],
    trainingFactors: ["barebow", "outside"]
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

  describe("Progress Chart", function() {
    it("Should return progress chart data as per user input from oldest to newest", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post(`/api/trainingRecords/`)
            .send(trainingRecord2)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord2)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .get("/api/charts/progress")
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(2);
          expect(res.body[0].session).to.equal(1);
          expect(res.body[0].score).to.equal(72);
          expect(res.body[1].session).to.equal(2);
          expect(res.body[1].score).to.equal(80);
        });
    });
  });

  describe("Compare Chart", function() {
    it("Should return chart for single additional factor and in the order from oldest to newest", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post(`/api/trainingRecords/`)
            .send(trainingRecordFactors)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecordFactors)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post("/api/charts/compare")
            .send({ selectedFactors: "outside" })
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(2);
          expect(res.body[0].session).to.equal(1);
          expect(res.body[0].score).to.equal(72);
          expect(res.body[1].session).to.equal(2);
          expect(res.body[1].score).to.equal(70);
        });
    });

    it("Should return chart for default additional factor", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post(`/api/trainingRecords/`)
            .send(trainingRecord2)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord2)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post("/api/charts/compare")
            .send({ selectedFactors: [] })
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(1);
          expect(res.body[0].session).to.equal(1);
          expect(res.body[0].score).to.equal(80);
        });
    });

    it("Should return chart for multiple additional factors", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post(`/api/trainingRecords/`)
            .send(trainingRecordFactors)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecordFactors)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post("/api/charts/compare")
            .send({ selectedFactors: ["barebow", "outside"] })
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          expect(res.body).to.have.length(1);
          expect(res.body[0].session).to.equal(1);
          expect(res.body[0].score).to.equal(70);
        });
    });
  });
});
