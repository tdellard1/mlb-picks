import {NextFunction, Request, Response} from 'express';
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {RedisClient} from "../../clients/redis-client.js";
import {FirebaseClient} from "../../services/firebase.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";
import {Team} from "../../models/teams/teams.model.js";
import {OffensiveStats} from "../../models/modals/offensive-stats.modal.js";
import {toHitting} from "../../models/interfaces/stats.interface.js";

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
            .filter(Game.isCompleted)
            .map(Game.toGameID);

        const homeGameIds: string[] = homeSchedule.schedule
            .filter(Game.isBeforeToday)
            .filter(Game.isCompleted)
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

    const fetchTeamStatsFromBoxScores = async ({query}: Request, response: Response) => {
        const [away, home]: string[] = query['teams'] as string[];
        const source: string = query['source'] as string;

        if (source === 'season') {
            const teamsString: string[] = await cacheClient.sMembers('teams');
            const teams: Team[] = teamsString.map((team: string) => new Team(JSON.parse(team)));

            const awayTeam: Team = teams.find(({teamAbv}) => teamAbv === away)!;
            const homeTeam: Team = teams.find(({teamAbv}) => teamAbv === home)!;

            const awayOffensiveStats: OffensiveStats = new OffensiveStats();
            const homeOffensiveStats: OffensiveStats = new OffensiveStats();

            awayOffensiveStats.addTeamStatsHitting(awayTeam.teamStats!);
            homeOffensiveStats.addTeamStatsHitting(homeTeam.teamStats!);

            awayOffensiveStats.finalizeOffensiveStats();
            homeOffensiveStats.finalizeOffensiveStats();

            response.json({
                away: {
                    name: away,
                    stats: [toHitting(awayTeam.teamStats!)]
                },
                home: {
                    name: home,
                    stats: [toHitting(homeTeam.teamStats!)]
                }
            });
        } else {
            const [awayScheduleString]: string[] = await cacheClient.sMembers(`schedule:${away}`);
            const [homeScheduleString]: string[] = await cacheClient.sMembers(`schedule:${home}`);

            const awaySchedule: Schedule = new Schedule(JSON.parse(awayScheduleString));
            const homeSchedule: Schedule = new Schedule(JSON.parse(homeScheduleString));

            const gameIds: Set<string> = new Set();

            const awayGameIds: string[] = awaySchedule.schedule
                .filter(Game.isBeforeToday)
                .filter(Game.isCompletedOrSuspended)
                .filter(Game.getIfSource(away, source, 'away', home))
                .map(Game.toGameID);

            const homeGameIds: string[] = homeSchedule.schedule
                .filter(Game.isBeforeToday)
                .filter(Game.isCompletedOrSuspended)
                .filter(Game.getIfSource(home, source, 'home', away))
                .map(Game.toGameID);

            awayGameIds.forEach(gameIds.add.bind(gameIds));
            homeGameIds.forEach(gameIds.add.bind(gameIds));

            const boxScoreRequests: Promise<string[]>[] = [...gameIds].map((gameID: string) => cacheClient.sMembers(`boxScore:${gameID}`));
            const boxScoreResponses: string[][] = await Promise.all(boxScoreRequests);
            const boxScores: BoxScore[] = boxScoreResponses.flat().map((boxScoreString: string) => new BoxScore(JSON.parse(boxScoreString)));

            response.json({
                away: {
                    name: away,
                    stats: boxScores
                        .filter(BoxScore.includedIn(awayGameIds))
                        .map(BoxScore.toTeamStats(away))
                        .map(toHitting)
                },
                home: {
                    name: home,
                    stats: boxScores
                        .filter(BoxScore.includedIn(homeGameIds))
                        .map(BoxScore.toTeamStats(home))
                        .map(toHitting)
                }
            });
        }
    }

    return {
        fetchBoxScoresForTeam,
        fetchAllBoxScoresFromCache,
        fetchTeamStatsFromBoxScores,
        fetchAllBoxScoresFromDatabase
    }
}