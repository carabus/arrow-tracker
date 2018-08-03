"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { Rank } = require("../ranks");
const { TrainingRecord } = require("../trainingRecords");
const { JWT_SECRET, TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("api/rank", function() {
  let USERS = [];

  const ranks = [
    {
      user: "user4",
      rank: "2"
    },
    {
      user: "user2",
      rank: "3"
    },
    {
      user: "user3",
      rank: "3"
    },
    {
      user: "user1",
      rank: "5"
    },
    {
      user: "user5",
      rank: "7"
    },
    {
      user: "user6",
      rank: "9"
    },
    {
      user: "user7",
      rank: "11"
    }
  ];

  const trainingRecord1 = {
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
  const trainingRecord2 = {
    distance: 16,
    distanceUnits: "yards",
    ends: [
      {
        arrows: [
          {
            score: 5
          },
          {
            score: 5
          },
          {
            score: 5
          }
        ]
      }
    ]
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

  afterEach(function() {
    return Rank.remove({})
      .then(() => User.remove({}))
      .then(() => TrainingRecord.remove());
  });

  function createRanks() {
    return Rank.insertMany(ranks);
  }

  describe("GET", function() {
    it("Should return correct rank percentile for the user", function() {
      return createRanks()
        .then(() => {
          return chai
            .request(app)
            .get(`/api/ranks/`)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.equal(50);
        });
    });
  });

  describe("POST", function() {
    it("Should calculate and insert user rank", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord1)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord1)
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
            .post("/api/ranks/")
            .send({})
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(201);
        })
        .then(() => {
          return Rank.findOne({ user: "user1" });
        })
        .then(rank => {
          expect(rank).to.not.be.null;
          expect(rank.rank).to.equal(70.5);
        });
    });

    it("Should upsert user rank on update", function() {
      return chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord1)
        .set("authorization", `Bearer ${USERS["user1"].token}`)
        .then(res => {
          return chai
            .request(app)
            .put(`/api/trainingRecords/${res.body.id}`)
            .send(trainingRecord1)
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(() => {
          return chai
            .request(app)
            .post("/api/ranks/")
            .send({})
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(201);
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
            .post("/api/ranks/")
            .send({})
            .set("authorization", `Bearer ${USERS["user1"].token}`);
        })
        .then(res => {
          expect(res).to.have.status(201);
        })
        .then(() => {
          return Rank.find({ user: "user1" });
        })
        .then(rank => {
          expect(rank).to.be.an("array");
          expect(rank).to.have.length(1);
          expect(rank[0].rank).to.equal(70.5);
        });
    });
  });
});
