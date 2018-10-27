'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../users');
const { TrainingRecord } = require('../trainingRecords');
const { TrainingFactor } = require('../trainingFactors');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('api/charts/progress', function() {
  let USERS = [];

  const trainingRecord = {
    distance: 20,
    distanceUnits: 'meters',
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
    trainingFactors: ['outside']
  };

  const trainingRecord2 = {
    distance: 30,
    distanceUnits: 'meters',
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
    distanceUnits: 'meters',
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
    trainingFactors: ['barebow', 'outside']
  };

  before(async function() {
    await runServer(TEST_DATABASE_URL);
  });

  after(async function() {
    await closeServer();
  });

  beforeEach(async function() {
    this.timeout(5000);
    await createUser('user1');
  });

  async function createUser(username) {
    const hash = await User.hashPassword(username);
    await User.create({ username, password: hash });
    return await getValidToken(username);
  }

  async function getValidToken(username) {
    const res = await chai
      .request(app)
      .post('/api/auth/login')
      .send({ username, password: username });
    USERS[username] = { token: res.body.authToken };
  }

  afterEach(async function() {
    await TrainingRecord.remove({});
    await User.remove({});
    await TrainingFactor.remove({});
  });

  describe('Progress Chart', function() {
    it('Should return progress chart data as per user input from oldest to newest', async function() {
      let res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord2)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord2)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      res = await chai
        .request(app)
        .get('/api/charts/progress')
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(2);
      expect(res.body[0].session).to.equal(1);
      expect(res.body[0].score).to.equal(72);
      expect(res.body[1].session).to.equal(2);
      expect(res.body[1].score).to.equal(80);
    });
  });

  describe('Compare Chart', function() {
    it('Should return chart for single additional factor and in the order from oldest to newest', async function() {
      let res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecordFactors)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecordFactors)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post('/api/charts/compare')
        .send({ selectedFactors: 'outside' })
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(2);
      expect(res.body[0].session).to.equal(1);
      expect(res.body[0].score).to.equal(72);
      expect(res.body[1].session).to.equal(2);
      expect(res.body[1].score).to.equal(70);
    });

    it('Should return chart for default additional factor', async function() {
      let res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);

      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord2)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord2)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post('/api/charts/compare')
        .send({ selectedFactors: [] })
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(1);
      expect(res.body[0].session).to.equal(1);
      expect(res.body[0].score).to.equal(80);
    });

    it('Should return chart for multiple additional factors', async function() {
      let res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecord)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post(`/api/trainingRecords/`)
        .send(trainingRecordFactors)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      await chai
        .request(app)
        .put(`/api/trainingRecords/${res.body.id}`)
        .send(trainingRecordFactors)
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      res = await chai
        .request(app)
        .post('/api/charts/compare')
        .send({ selectedFactors: ['barebow', 'outside'] })
        .set('authorization', `Bearer ${USERS['user1'].token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(1);
      expect(res.body[0].session).to.equal(1);
      expect(res.body[0].score).to.equal(70);
    });
  });
});
