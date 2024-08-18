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
import slatesRouter from "./app/routes/slates/slates.router.js";
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
const EveryHourBetween7AMand10AM: string = '0 7-10 * * *';
const ThirtyMinutesAfterEveryTwoHours: string = '30 */2 * * *'; // 12am, 2am, 4am, 6am, 8am, 10am, 12pm, 2pm, 4pm, 6pm, 8pm, and 10pm

const updateHourly: Job = schedule.scheduleJob(EveryHour, async () => await modernizeRosters());
const updateHourlyBetweenSevenAndTen: Job = schedule.scheduleJob(EveryHourBetween7AMand10AM, async () => await modernizeSchedulesAndPlayers());
const duoHourly: Job = schedule.scheduleJob(ThirtyMinutesAfterEveryTwoHours, async () => await reconcileBoxScores());

const api: Router = Router()
  .use('/boxScores', boxScoreRouter())
  .use('/analysis', analysisRouter())
  .use('/players', playersRouter())
  .use('/slates', slatesRouter())
  .use(schedulesController)
  .use('/teams', teamsRouter())
  .use('/update', updateRouter())
  .use('/rosters', rosterRouter());

app.use('/api', api);

export default app;
