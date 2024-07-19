const apiRouter = require("./routes");
const pathToClientApp = '../../dist/mlb-picks/browser';


(async () => {
  const client = await require('./singletons/redis').client();
  await require('./singletons/loadData')();
  await require('./singletons/express-app')(pathToClientApp, apiRouter);
  process.on('exit', () => {
    client.disconnect();
    client.quit();
    console.log('Closing client connection...', client.isOpen);
  });
})();


