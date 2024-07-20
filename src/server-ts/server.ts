import apiRouter from './routes/index.js';
const pathToClientApp: string = '../../../dist/mlb-picks/browser';
import {client} from './singletons/redis.js'
import {app} from './singletons/express-app.js';
import loadData from './singletons/loadData.js';

(async () => {
  const redisClient = await client();
  await loadData();
  await app(pathToClientApp, apiRouter);
  process.on('SIGINT', async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    console.log('Closing client connection...');
    process.exit(0);
  });
})();
