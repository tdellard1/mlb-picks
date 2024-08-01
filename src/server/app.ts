import type {Express} from "express";
import type {Job} from "node-schedule";
import express, {Router} from "express";
import schedule from "node-schedule";
import logger from 'morgan';
import compression from "compression";
import cors from "cors";
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {quarterDailyUpdate, halfDailyUpdate} from "./app/scheduler/scheduler.js";
import rostersController from "./app/routes/rosters/rosters.controller.js";
import boxScoresController from "./app/routes/boxScores/box-scores.controller.js";
import playersController from "./app/routes/players/players.controller.js";
import teamsController from "./app/routes/teams/teams.controller.js";
import schedulesController from "./app/routes/schedules/schedules.controller.js";

const app: Express = express();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/browser')));

const job: Job = schedule.scheduleJob('0 */6 * * *', async () => await quarterDailyUpdate());
const job2: Job = schedule.scheduleJob('30 */12 * * *', async () => await halfDailyUpdate());

const api: Router = Router()
  .use(boxScoresController)
  .use(playersController)
  .use(schedulesController)
  .use(teamsController)
  .use(rostersController);

app.use('/api', api);

export default app;
