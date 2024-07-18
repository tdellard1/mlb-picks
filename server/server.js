const apiRouter = require("./routes");
const pathToClientApp = '../dist/mlb-picks/browser';


(async () => {
  await require('./singletons/loadData')();
  const app = require('./singletons/express-app')(pathToClientApp, apiRouter);
})();


