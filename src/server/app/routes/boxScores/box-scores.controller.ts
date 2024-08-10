import {NextFunction, Request, Response} from 'express';
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {RedisClient} from "../../clients/redis-client.js";
import {FirebaseClient} from "../../services/firebase.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";
import {RosterPlayer} from "../../models/players/roster-player.model.js";
import {getPlayerInfo} from "../../services/tank-01.service.js";
import {AxiosResponse} from "axios";

export function boxScoreController(firebase: FirebaseClient, redis: RedisClient) {
    const database: FirebaseClient = firebase;
    const cacheClient: RedisClient = redis;

    const fetchAllBoxScoresFromCache = async (_: Request, response: Response, next: NextFunction) => {
        const exists: boolean = await cacheClient.exists('boxScores') > 0;
        if (!exists) next();

        const boxScoreStringSet: string[] = await cacheClient.sMembers('boxScores');
        const boxScores: BoxScore[] = boxScoreStringSet.map((boxScoreString) => JSON.parse(boxScoreString));

        response.json(boxScores);
    }

    const fetchAllBoxScoresFromDatabase = async (request: Request, response: Response, next: NextFunction) => {
        const boxScores: BoxScore[] = await database.downloadFileWithType('boxScores', BoxScore);
        if (boxScores.length < 1) response.status(404).end();

        response.json(boxScores);
    }

    const fetchBoxScoresForTeam = async (request: Request, response: Response, next: NextFunction) => {
        const teams: string[] = request.query['teams'] as string[];

        const awayScheduleStringSet: string[] = await cacheClient.sMembers(`schedule:${teams[0]}`);
        const awaySchedule: Schedule = new Schedule(JSON.parse(awayScheduleStringSet[0]));

        const homeScheduleStringSet: string[] = await cacheClient.sMembers(`schedule:${teams[1]}`);
        const homeSchedule: Schedule = new Schedule(JSON.parse(homeScheduleStringSet[0]));

        const gameIds: Set<string> = new Set();

        const awayGameIds: string[] = awaySchedule.schedule
            .filter(Game.isBeforeToday)
            .filter(Game.gameIsCompleted)
            .map(Game.toGameID);

        const homeGameIds: string[] = homeSchedule.schedule
            .filter(Game.isBeforeToday)
            .filter(Game.gameIsCompleted)
            .map(Game.toGameID);

        awayGameIds.forEach(gameIds.add.bind(gameIds));
        homeGameIds.forEach(gameIds.add.bind(gameIds));

        const boxScoreKeys: string[] = [];

        gameIds.forEach((gameId: string) => {
            boxScoreKeys.push(`boxScore:${gameId}`);
        });

        const boxScorePromises: Promise<string[]>[] = boxScoreKeys.map((key: string) => cacheClient.sMembers(key));
        const boxScoreResolvers: string[][] = await Promise.all(boxScorePromises);
        const boxScores: BoxScore[] = boxScoreResolvers.flat().map((boxScoreString: string) => new BoxScore(JSON.parse(boxScoreString)));

        const home: BoxScore[] = boxScores
            .filter(BoxScore.includedIn(homeGameIds))
            .sort(BoxScore.sortChronologically);

        const away: BoxScore[] = boxScores
            .filter(BoxScore.includedIn(awayGameIds))
            .sort(BoxScore.sortChronologically);

        const rosterPlayerIDs: Set<string> = new Set();

        [...away, ...home].map(({playerStats}) => Object.keys(playerStats!)).flat().forEach(rosterPlayerIDs.add.bind(rosterPlayerIDs));


        response.json({home, away});
    }

    return {
        fetchAllBoxScoresFromCache,
        fetchAllBoxScoresFromDatabase,
        fetchBoxScoresForTeam
    }
}