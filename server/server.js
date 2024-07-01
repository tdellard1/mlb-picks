const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const teams = require('./assets/teams.json');
const players = require('./assets/players.json');
const schedules = require('./assets/schedules.json');
const boxScore = require('./assets/boxScore.json');
const slates = require('./assets/slates.json');
const cors = require('cors');
const { writeFile, readFile } = require("fs");

app.use(express.static(path.join(__dirname, '../dist')));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(cors());

const boxScoreURL = './assets/boxScore.json';
const schedulesURL = './assets/schedules.json';
const slatesURL = './assets/slates.json';

app.get('/', (req, res) => {
  res.send('Hello World from Node.js server!');
});

// route for handling requests from the Angular client
app.get('/api/teams', (req, res) => {
  res.json({ teams });
});

app.get('/api/players', (req, res) => {
  res.json({ players });
});

app.get('/api/schedules', (req, res) => {
  res.json({ schedules });
});

app.get('/api/boxScore', (req, res) => {
  res.json({ boxScore });
});

app.get('/api/slates', (req, res) => {
  res.json({ slates });
});

app.post('/api/boxScore', (req, res) => {
  console.log('req: ', req.body);
  writeFile(boxScoreURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

app.post('/api/slates', (req, res) => {
  console.log('req: ', req.body);
  writeFile(slatesURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

app.post('/api/schedules', (req, res) => {
  console.log('req: ', JSON.stringify(req.body));
  writeFile(schedulesURL, JSON.stringify(req.body, null, 2), err => {
    if (err) {
      console.log("Failed to write updated data to file");
      return;
    }
    res.json({"message": "Updated file successfully"});
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
