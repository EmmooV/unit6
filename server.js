const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");
const path = require('path');
const cors = require('cors');

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();


app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use("/tests", express.static(path.join(__dirname, "__tests__")));

// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled);
  } catch (error) {
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1;
      res.status(200).send("You won!");
    }
  } catch (error) {
    console.log("ERROR DUELING", error);
    rollbar.error('Error dueling', {
      compDuo,
      playerDuo,
      error: error.message,
      stackTrace: error.stack,
    });
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  try {
    res.status(200).send(playerRecord);
    rollbar.log('custom_event', {
      message: 'Cutom event occurred',
      data: {
        playerRecord,
        timestamp: new Date().toISOString(),
      }
    })
  } catch (error) {
    rollbar.error(error);
    rollbar.warning('Potential performance issue detected');
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '49b664248e7f4c5498930e08c7ef27b8',
  captureUncaught: true,
  captureUnhandledRejections: true,
})
rollbar.log('Hello world!')

app.listen(8000, () => {
  console.log(`Listening on 8000`);
  rollbar.info('Application started');
});
