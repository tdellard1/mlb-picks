const express = require('express');
const { json, urlencoded } = express;
const app = express();
const port = 3000;
const path = require('path');
const apiRouter = require("./routes");
const cors = require('cors');
const pathToClientApp = '../dist/mlb-picks/browser';

app.use(json({limit: '150mb'}));
app.use(urlencoded({limit: '150mb', extended: true}));
app.use(cors());

app.use(express.static(path.join(__dirname, pathToClientApp)));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, pathToClientApp + '/index.html'));
});

app.use('/api', apiRouter);

app.listen(process.env.PORT || port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
