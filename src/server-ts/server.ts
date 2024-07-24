import apiRouter from './routes/index.js';
const pathToClientApp: string = '../../../../dist/mlb-picks/browser';
import {client} from './singletons/redis.js'
import {app} from './singletons/express-app.js';
import loadData, {load} from './singletons/loadData.js';
import schedule, {Job} from 'node-schedule';
import { dailyUpdate } from './functions/dailyUpdate.js';

(async () => {
  const redisClient = await client();
  await loadData();
  await app(pathToClientApp, apiRouter);

  const job: Job = schedule.scheduleJob('0 0 * * *', async () => dailyUpdate());
  // await dailyUpdate();
  process.on('SIGINT', async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    console.log('Closing client connection...');
    process.exit(0);
  });
})();
