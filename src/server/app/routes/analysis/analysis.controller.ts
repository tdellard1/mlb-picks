import {Request, Response} from 'express';
import {RedisClient} from "../../clients/redis-client.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";
import {BoxScore} from "../../models/boxScores/box-scores.model.js";

declare type ParsedTeams = {home: string, away: string};

export default function analysisController(redis: RedisClient) {
    const cache: RedisClient = redis;

    function parseTeamsFromGameID(gameID: string): ParsedTeams {
        const bothTeams: string[] = gameID.split('_')[1].split('@');
        const home: string = bothTeams[0];
        const away: string = bothTeams[1];

        return {home, away}
    }

    function getRecentGameIDsFromSchedule({schedule}: Schedule): string[] {
        const topOfToday: number = new Date().setHours(0, 0, 0, 0);

        return schedule
            .filter(({gameTime_epoch}) => Number(gameTime_epoch) * 1000 < topOfToday)
            .filter(({gameStatus}) => gameStatus === 'Completed')
            .sort((aGame: Game, bGame: Game) => {
                const aGameStart: number = Number(aGame.gameTime_epoch);
                const bGameStart: number = Number(bGame.gameTime_epoch);
                return aGameStart - bGameStart;
            })
            .slice(-15)
            .map(({gameID}) => gameID)
            .flat();
    }

    function scheduleToMostRecentGames(schedule: Schedule) {
        const topOfToday: number = new Date().setHours(0, 0, 0, 0);

        schedule.schedule = schedule.schedule
            .filter(({gameTime_epoch}) => Number(gameTime_epoch) * 1000 < topOfToday)
            .filter(({gameStatus}) => gameStatus === 'Completed')
            .sort((aGame: Game, bGame: Game) => {
                const aGameStart: number = Number(aGame.gameTime_epoch);
                const bGameStart: number = Number(bGame.gameTime_epoch);
                return aGameStart - bGameStart;
            })
            .slice(-15);

        return schedule;
    }

    async function getBoxScoresFromGameIDs(gameIDs: string[], cacheClient: RedisClient): Promise<BoxScore[]> {
        const boxScoreKeys: string[] = gameIDs.map(gameID => `boxScore:${gameID}`);
        const boxScorePromises: Promise<string[]>[] = boxScoreKeys.map((key: string) => cacheClient.sMembers(key));
        const boxScoreResolvers: string[][] = await Promise.all(boxScorePromises);
        return boxScoreResolvers.flat().map((boxScoreString: string) => new BoxScore(JSON.parse(boxScoreString)));
    }

    function addBoxScoresToSchedule(boxScores: BoxScore[], schedule: Schedule): Schedule {
        const mBoxScores: Map<string, BoxScore> = new Map<string, BoxScore>();

        boxScores.forEach((boxScore: BoxScore) =>
            mBoxScores.set(boxScore.gameID, boxScore));

        schedule.schedule = schedule.schedule.map((game: Game) => {
            if (!mBoxScores.has(game.gameID)) {
                throw new Error('BoxScore unavailable for scheduled game');
            } else {
                game.boxScore = mBoxScores.get(game.gameID)!;
                return game;
            }
        });

        return schedule;
    }

    async function getAnalysisForGame<T>(request: Request, response: Response) {
        const gameID: string = request.params.gameID;

        const {home, away}: ParsedTeams = parseTeamsFromGameID(gameID);

        const homeScheduleStrings: string[] = await cache.sMembers(`schedule:${home}`);
        const awayScheduleStrings: string[] = await cache.sMembers(`schedule:${away}`);

        const homeSchedule: Schedule = new Schedule(JSON.parse(homeScheduleStrings[0]));
        const awaySchedule: Schedule = new Schedule(JSON.parse(awayScheduleStrings[0]));

        const recentHomeSchedule: Schedule = scheduleToMostRecentGames(homeSchedule);
        const recentAwaySchedule: Schedule = scheduleToMostRecentGames(awaySchedule);

        const homeGameIdentifiers: string[] = getRecentGameIDsFromSchedule(homeSchedule);
        const awayGameIdentifiers: string[] = getRecentGameIDsFromSchedule(awaySchedule);

        const homeBoxScores: BoxScore[] = await getBoxScoresFromGameIDs(homeGameIdentifiers, cache);
        const awayBoxScores: BoxScore[] = await getBoxScoresFromGameIDs(awayGameIdentifiers, cache);

         addBoxScoresToSchedule(homeBoxScores, recentHomeSchedule);
         addBoxScoresToSchedule(awayBoxScores, recentAwaySchedule);

        response.json({
            home: recentHomeSchedule,
            away: recentAwaySchedule
        });
    }

    return {
        getAnalysisForGame,
    }
}