import {Request, Response} from 'express';
import {RedisClient} from "../../clients/redis-client.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {Team} from "../../models/teams/teams.model.js";

export default function analysisController(redis: RedisClient) {
    const cache: RedisClient = redis;

    async function getSchedule(team: string): Promise<Schedule> {
        const scheduleStringSet: string[] = await cache.sMembers(`schedule:${team}`);
        const scheduleString: string = scheduleStringSet[0];
        const scheduleData: any = JSON.parse(scheduleString);
        return new Schedule(scheduleData);
    }

    async function getBoxScoresFromGameIDs(gameIDs: Set<string>): Promise<BoxScore[]> {
        const boxScoreKeys: string[] = [...gameIDs].map(gameID => `boxScore:${gameID}`);
        const boxScorePromises: Promise<string[]>[] = boxScoreKeys.map((key: string) => cache.sMembers(key));
        const boxScoreResolvers: string[][] = await Promise.all(boxScorePromises);
        return boxScoreResolvers.flat().map((boxScoreString: string) => new BoxScore(JSON.parse(boxScoreString)));
    }

    async function getAnalysisSchedule({team, schedule}: Schedule, boxScores: BoxScore[]) {
        const analysisSchedule: Schedule = { team } as Schedule;

        analysisSchedule.schedule = schedule.slice().map((game: Game) => {
            const boxScore: BoxScore | undefined = boxScores.find(({gameID}) => gameID === game.gameID);

            if (!boxScore) throw new Error('BoxScore unavailable for scheduled game');

            game.boxScore = boxScore;
            return game
        });

        return analysisSchedule;
    }

    async function getAnalysisForGame<T>(request: Request, response: Response) {
        const gameID: string = request.params.gameID;
        const teams: string[] = gameID.split('_')[1].split('@');

        const teamStringSet: string[] = await cache.sMembers('teams');
        const teamArray: Team[] = teamStringSet.map((scheduleString: string) => new Team(JSON.parse(scheduleString)));
        const awayTeam: Team | undefined = teamArray.find(({teamAbv}) => teamAbv === teams[0]);
        const homeTeam: Team | undefined = teamArray.find(({teamAbv}) => teamAbv === teams[1]);

        const awaySchedule: Schedule = await getSchedule(teams[0]);
        const homeSchedule: Schedule = await getSchedule(teams[1]);

        awaySchedule.schedule = Schedule.get15MostRecentGames(awaySchedule);
        homeSchedule.schedule = Schedule.get15MostRecentGames(homeSchedule);

        const gameIDs: Set<string> = new Set<string>([
            ...awaySchedule.schedule.map(({gameID}) => gameID),
            ...homeSchedule.schedule.map(({gameID}) => gameID)
        ]);

        const boxScores: BoxScore[] = await getBoxScoresFromGameIDs(gameIDs);

        const away: Schedule = await getAnalysisSchedule(awaySchedule, boxScores);
        const home: Schedule = await getAnalysisSchedule(homeSchedule, boxScores);

        response.json({
            home: {
                team: homeTeam,
                schedule: home.schedule
            },
            away: {
                team: awayTeam,
                schedule: away.schedule
            },
        });
    }

    return {
        getAnalysisForGame,
    }
}