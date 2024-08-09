import {NextFunction, Request, Response} from 'express';
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {RedisClient} from "../../clients/redis-client.js";
import {FirebaseClient} from "../../services/firebase.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";

export function boxScoreController(firebase: FirebaseClient, redis: RedisClient) {
    const database: FirebaseClient = firebase;
    const cacheClient: RedisClient = redis;

    async function fetchBAM<T>(key: string, type: { new(parse: any): T; }): Promise<T[]> {
        const exists: boolean = await cacheClient.exists(key) > 0;

        if (exists) {
            const cachedResults: string[] = await cacheClient.sMembers(key);
            return cachedResults.map((result: string) => new type(JSON.parse(result)))
        }

        const results: T[] = await database.downloadFileWithType<T>(key, type);

        if (results.length > 0) {
            return results;
        } else {
            throw new Error(`Couldn\'t find any ${key}`);
        }
    }

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

        response.json({home, away});
    }

    return {
        fetchAllBoxScoresFromCache,
        fetchAllBoxScoresFromDatabase,
        fetchBoxScoresForTeam
    }
}