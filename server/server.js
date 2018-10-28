'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

const { router: usersRouter } = require('./users');
const { router: trainingFactorsRouter } = require('./trainingFactors');
const { router: trainingRecordsRouter } = require('./trainingRecords');
const { router: chartsRouter } = require('./charts');
const { router: ranksRouter } = require('./ranks');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/trainingFactors/', trainingFactorsRouter);
app.use('/api/trainingRecords/', trainingRecordsRouter);
app.use('/api/charts/', chartsRouter);
app.use('/api/ranks/', ranksRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/.well-known/acme-challenge/:content', function(req, res) {
  res.send(
    '9n-QQ5nB3EtBi1ePPgqdExKdu1KH2WhPUKLo4w92TIg.DtLBkGzwbg-xYCzCsFq-h7lTlItHloaenp3LGr8okm0'
  );
});

app.use('*', (req, res) => {
  const filePath = path.join(__dirname, '../client/build', req.baseUrl);
  const index = path.join(__dirname, '../client/build', 'index.html');
  fs.stat(filePath, (err, data) => {
    res.sendFile(data && data.isFile() ? filePath : index);
  });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      databaseUrl,
      err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      }
    );
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
