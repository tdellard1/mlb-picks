const express = require('express');
const { json, urlencoded } = express;
const app = express();
const port = 3000;
const path = require('path');
const apiRouter = require("./routes");
const cors = require('cors');
const pathToClientApp = '../dist/mlb-picks/browser';
const { loadDataToCache } = require('./firebase.init');
const firebaseFileKeys = ['boxScores', 'rosters', 'teams', 'slates', 'schedules', 'players'];
function startServer() {
  console.log(`Start server called!`);
  app.listen(process.env.PORT || port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

function write(array) {
  const promises = [];
  for(let key of array) {
    console.log(key, firebaseFileKeys);
    promises.push(loadDataToCache(key));
  }
  return Promise.all(promises);
}

write(firebaseFileKeys).then(() => {
  startServer();
});

console.log('App configuration started.');
app.use(json({limit: '250mb'}));
app.use(urlencoded({limit: '250mb', extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, pathToClientApp)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, pathToClientApp + '/index.html'));
});

app.use('/api', apiRouter);
console.log('App configuration finished.');


