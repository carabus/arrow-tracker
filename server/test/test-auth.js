"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");

const { app, runServer, closeServer } = require("../server");
const { User } = require("../users");
const { TEST_DATABASE_URL } = require("../config");

const expect = chai.expect;

chai.use(chaiHttp);

describe("/api/auth", function() {
  const username = "exampleUser";
  const name = "Example";

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe("Social Login", function() {
    it("Should perform social login where there were no previous user record", function() {
      return chai
        .request(app)
        .post("/api/auth/socialLogin")
        .send({
          username,
          name
        })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.keys("authToken");
          return User.findOne({
            username
          });
        })
        .then(user => {
          expect(user).to.not.be.null;
          expect(user.name).to.equal(name);
        });
    });

    it("Should perform social login for existing user", function() {
      return User.create({ username, name }).then(user => {
        return chai
          .request(app)
          .post("/api/auth/socialLogin")
          .send({
            username,
            name
          })
          .then(res => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.keys("authToken");
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.name).to.equal(name);
          });
      });
    });
  });
});
