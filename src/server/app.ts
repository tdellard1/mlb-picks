import type {Express} from "express";
import type {Job} from "node-schedule";
import express, {Router} from "express";
import schedule from "node-schedule";
import logger from 'morgan';
import cors from "cors";
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {quarterDailyUpdate, reconcileBoxScores} from "./app/scheduler/scheduler.js";
import rostersController from "./app/routes/rosters/rosters.controller.js";
import playersRouter from "./app/routes/players/players.router.js";
import schedulesController from "./app/routes/schedules/schedules.controller.js";
import boxScoreRouter from "./app/routes/boxScores/box-scores.router.js";
import analysisRouter from "./app/routes/analysis/analysis.router.js";
import teamsRouter from "./app/routes/teams/teams.router.js";
import slatesRouter from "./app/routes/slates/slates.router.js";

const app: Express = express();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/browser')));

const job: Job = schedule.scheduleJob('0 */6 * * *', async () => await quarterDailyUpdate());
const job2: Job = schedule.scheduleJob('30 */12 * * *', async () => await reconcileBoxScores());


const api: Router = Router()
  .use('/boxScores', boxScoreRouter())
  .use('/analysis', analysisRouter())
  .use('/players', playersRouter())
  .use('/slates', slatesRouter())
  .use(schedulesController)
  .use('/teams', teamsRouter())
  .use(rostersController);

app.use('/api', api);

export default app;
