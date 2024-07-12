const express = require('express');
const { json, urlencoded } = express;
const app = express();
const port = 3000;
const path = require('path');
const apiRouter = require("./routes");
const cors = require('cors');
const pathToClientApp = '../dist/mlb-picks/browser';
const { initializeApp } = require("firebase/app");
const firebaseConfig2 = {
  apiKey: "AIzaSyAJbrUUSPEwfhxAax7qOYq9-QV_eg61o1U",
  authDomain: "mlb-picks-2162b.firebaseapp.com",
  projectId: "mlb-picks-2162b",
  storageBucket: "mlb-picks-2162b.appspot.com",
  messagingSenderId: "1062344277302",
  appId: "1:1062344277302:web:dece8657a6165b351d0797",
  measurementId: "G-3123M9SGD1"
};

initializeApp(firebaseConfig2);

app.use(json({limit: '250mb'}));
app.use(urlencoded({limit: '250mb', extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, pathToClientApp)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, pathToClientApp + '/index.html'));
});


app.use('/api', apiRouter);

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
