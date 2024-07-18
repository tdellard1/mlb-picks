const express = require("express");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3000;

module.exports = async (clientPath, apiRouter) => {
  const app = express();

  app.use(express.json({limit: '250mb'}));
  app.use(express.urlencoded({limit: '250mb', extended: true}));
  app.use(express.static(path.join(__dirname, clientPath)));
  app.use(cors());

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, clientPath + '/index.html'));
  });

  app.use('/api', apiRouter);
  app.listen(port, () => {
    console.log('##########################################################');
    console.log('#####               STARTING SERVER                  #####');
    console.log('##########################################################\n');
    console.log(`Server listening at http://localhost:${port}`);
  });

  return app;
}
