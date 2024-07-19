const apiRouter = require("./routes");
const pathToClientApp = '../../dist/mlb-picks/browser';


(async () => {
  const client = await require('./singletons/redis').client();
  await require('./singletons/loadData')();
  await require('./singletons/express-app')(pathToClientApp, apiRouter);
  process.on('SIGINT', async () => {
    if (client.isOpen) {
      await client.quit();
    }
    console.log('Closing client connection...');
    process.exit(0);
  });
})();


