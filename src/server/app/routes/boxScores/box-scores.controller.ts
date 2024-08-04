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

    const fetchRecentBoxScoresOfSchedules = async (request: Request, response: Response, next: NextFunction) => {
        const schedules: Schedule[] = await fetchBAM('schedules', Schedule);
        const boxScores: BoxScore[] = await fetchBAM('boxScores', BoxScore);

        const topOfToday: number = new Date().setHours(0, 0, 0, 0);
        let gameIDs: Set<string> = new Set();

        schedules.forEach(({schedule}: Schedule) => {
            const allGameIDs: string[] = schedule
                .filter(({gameTime_epoch}) => Number(gameTime_epoch) * 1000 < topOfToday)
                .filter(({gameStatus}) => gameStatus === 'Completed')
                .sort((aGame: Game, bGame: Game) => {
                    const aGameStart: number = Number(aGame.gameTime_epoch);
                    const bGameStart: number = Number(bGame.gameTime_epoch);
                    return aGameStart - bGameStart; })
                .slice(-15)
                .map(({gameID}) => gameID);

            gameIDs = new Set(allGameIDs);
        });

        if (gameIDs.size !== 225) {
            throw new Error('Total games isn\'t right')
        }

        gameIDs.forEach(gameID => {

        });


        if (boxScores.length < 1) response.status(404).end();

        response.json(boxScores);
    }

    return {
        fetchAllBoxScoresFromCache,
        fetchAllBoxScoresFromDatabase
    }
}