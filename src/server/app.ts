import type {Express} from "express";
import type {Job} from "node-schedule";
import express, {Router} from "express";
import schedule from "node-schedule";
import logger from 'morgan';
import cors from "cors";
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {
    modernizeRosters, modernizeSchedulesAndPlayers,
    reconcileBoxScores
} from "./app/scheduler/scheduler.js";
import playersRouter from "./app/routes/players/players.router.js";
import schedulesController from "./app/routes/schedules/schedules.controller.js";
import boxScoreRouter from "./app/routes/boxScores/box-scores.router.js";
import analysisRouter from "./app/routes/analysis/analysis.router.js";
import teamsRouter from "./app/routes/teams/teams.router.js";
import rosterRouter from "./app/routes/rosters/rosters.router.js";
import updateRouter from "./app/routes/update/update.router.js";

const app: Express = express();

const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

app.set('trust proxy', true);
app.use(cors());
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'client/browser')));

const EveryHour: string = '0 * * * *';
const EveryDayAtNineThirtyAM: string = '30 9 * * *';
const EveryDay9AM: string = '* 9 * * *';

const updateHourly: Job = schedule.scheduleJob(EveryHour, async () => await modernizeRosters());
const updateHourlyBetweenSevenAndTen: Job = schedule.scheduleJob(EveryDay9AM, async () => await modernizeSchedulesAndPlayers());
const duoHourly: Job = schedule.scheduleJob(EveryDayAtNineThirtyAM, async () => await reconcileBoxScores());

const api: Router = Router()
  .use('/boxScores', boxScoreRouter())
  .use('/analysis', analysisRouter())
  .use('/players', playersRouter())
  .use(schedulesController)
  .use('/teams', teamsRouter())
  .use('/update', updateRouter())
  .use('/rosters', rosterRouter());

app.use('/api', api);

export default app;
