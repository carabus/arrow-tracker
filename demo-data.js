const fetch = require("node-fetch");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, TEST_DATABASE_URL } = require("./config");

API_BASE_URL = "http://localhost:8080/api";

const start = async () => {
  let users = [];
  for (let i = 0; i < 10; i++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = `${firstName}.${lastName}`;
    const password = faker.internet.password();
    const token = "";

    users.push({ username, password, firstName, lastName, token });
  }

  await asyncForEach(users, async user => {
    console.log(`------------CREATING USER ${user.username}------------`);

    const resUsers = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    });
    let dataUsers = await resUsers.json();

    console.log(`------------LOGGING IN USER ${user.username}------------`);
    const resLogin = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(user)
    });
    let dataLogin = await resLogin.json();

    const authToken = dataLogin.authToken;
    const sessions = generateSessions(user.username);
    console.log(
      `------------CREATING SESSIONS FOR USER ${user.username}------------`
    );

    await asyncForEach(sessions, async session => {
      const resSessionsPost = await fetch(`${API_BASE_URL}/trainingRecords`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(session)
      });
      const dataSessionsPost = await resSessionsPost.json();

      const resSessionsPut = await fetch(
        `${API_BASE_URL}/trainingRecords/${dataSessionsPost.id}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify(session)
        }
      );
      const dataSessionsPut = await resSessionsPut.json();
    });

    console.log(`------------GENERATING RANK for ${user.username}------------`);
    const resRank = await fetch(`${API_BASE_URL}/ranks`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authToken}`
      }
    });
    let dataRank = await resRank.json();
  });
};
start();

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function generateSessions(username) {
  const distanceUnitsList = ["meters", "yards"];
  const additionalFactorsList = [
    "barebow",
    "outdoors",
    "fancy arrows",
    "with stabilizer"
  ];

  let sessions = [];
  const sessionCount = getRandomInt(50, 70);
  for (let i = 0; i < sessionCount; i++) {
    let ends = [];
    const endCount = getRandomInt(30, 50);
    const arrowCount = getRandomInt(3, 5);
    for (let j = 0; j < endCount; j++) {
      let arrows = [];
      for (k = 0; k < arrowCount; k++) {
        arrows.push(generateArrow());
      }
      ends.push({ arrows });
    }

    const distance = getRandomInt(10, 30);
    const distanceUnits = distanceUnitsList[getRandomInt(0, 1)];
    const trainingFactors = [additionalFactorsList[getRandomInt(0, 3)]];
    sessions.push({ distance, distanceUnits, trainingFactors, ends });
  }
  return sessions;
}

function generateArrow() {
  const x = getRandomInt(0, 300);
  const y = getRandomInt(0, 300);
  const score = calculateScore({ x, y });
  return {
    coordinates: { x, y },
    score: score.score,
    isInverted: score.isInverted,
    isBullseye: score.isBullseye
  };
}

function calculateScore(position) {
  const targetScoreRange = [
    {
      minRadius: 0,
      maxRadius: 7,
      invert: false,
      points: 10,
      bullseye: true
    },
    {
      minRadius: 8,
      maxRadius: 15,
      invert: false,
      points: 10,
      bullseye: false
    },
    {
      minRadius: 16,
      maxRadius: 30,
      invert: false,
      points: 9,
      bullseye: false
    },
    {
      minRadius: 31,
      maxRadius: 45,
      invert: false,
      points: 8,
      bullseye: false
    },
    {
      minRadius: 46,
      maxRadius: 60,
      invert: false,
      points: 7,
      bullseye: false
    },
    {
      minRadius: 61,
      maxRadius: 75,
      invert: false,
      points: 6,
      bullseye: false
    },
    {
      minRadius: 76,
      maxRadius: 90,
      invert: false,
      points: 5,
      bullseye: false
    },
    {
      minRadius: 91,
      maxRadius: 105,
      invert: true,
      points: 4,
      bullseye: false
    },
    {
      minRadius: 106,
      maxRadius: 120,
      invert: true,
      points: 3,
      bullseye: false
    },
    {
      minRadius: 121,
      maxRadius: 135,
      invert: false,
      points: 2,
      bullseye: false
    },
    {
      minRadius: 136,
      maxRadius: 150,
      invert: false,
      points: 1,
      bullseye: false
    }
  ];
  let distanceFromCenter = Math.trunc(
    Math.sqrt(Math.pow(150 - position.x, 2) + Math.pow(150 - position.y, 2))
  );

  let score = targetScoreRange.find(
    item =>
      distanceFromCenter <= item.maxRadius &&
      distanceFromCenter >= item.minRadius
  );

  return score
    ? {
        score: score.points,
        isInverted: score.invert,
        isBullseye: score.bullseye
      }
    : { score: 0, isInverted: false, isBullseye: false };
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
