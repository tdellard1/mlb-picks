import {NextFunction, Request, Response} from 'express';
import {Team} from "../../models/teams/teams.model.js";
import {RedisClient} from "../../clients/redis-client.js";
import {FirebaseClient} from "../../services/firebase.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {Game} from "../../models/schedules/games/game.model.js";


export default function teamsController(firebase: FirebaseClient, redis: RedisClient) {
    const cache: RedisClient = redis;
    const database: FirebaseClient = firebase;

    const fetchTeamsFromCache = async (): Promise<Team[]> => {
        const teamStringSet: string[] = await cache.sMembers('teams');
        return teamStringSet.map((teamString) => new Team(JSON.parse(teamString)));
    }

    const fetchTeamsFromDatabase = async () => {
        return await database.downloadFileWithType<Team>('teams', Team);
    }

    async function getTeamsNRFIPercentage(request: Request, response: Response, next: NextFunction) {
        const schedulesStringSet: string[] = await cache.sMembers('schedules');
        const schedules: Schedule[] = schedulesStringSet.map((scheduleString) => new Schedule(JSON.parse(scheduleString)));

        if (schedules.length !== 30) {
            console.log('Schedule count incorrect');
        }

        const teamNRFIPercentage: {[team: string]: string} = {};

        schedules.forEach(({team, schedule}) => {
            const games: Game[] = schedule.filter(({lineScore}: Game) => lineScore !== undefined && lineScore !== null);

            const totalGames: number = games.length;
            let gamesWithNoRunsFirstInning: number = 0;

            games.forEach(({lineScore}: Game) => {
                const isAway: boolean = lineScore.away.team === team;
                const isHome: boolean = lineScore.home.team === team;

                if (!isAway && !isHome) {
                    throw new Error('Team from schedule isn\'t home or away.');
                }


                if (isAway && lineScore.away.scoresByInning['1'] === '0') {
                    gamesWithNoRunsFirstInning++;
                } else if (isHome && lineScore.home.scoresByInning['1'] === '0') {
                    gamesWithNoRunsFirstInning++;
                }
            });

            const noRunsFirstInningRatio: number = gamesWithNoRunsFirstInning / totalGames;
            const noRunsFirstInningPercentage: number = noRunsFirstInningRatio * 100;
            teamNRFIPercentage[team] = noRunsFirstInningPercentage.toFixed(2);
        });

        response.json(teamNRFIPercentage);
    }

    async function getTeams<T>(request: Request, response: Response, next: NextFunction) {
        let teams: Team[] = await fetchTeamsFromCache();

        if (teams.length === 30) {
            response.json(teams);
        } else {
            teams = await fetchTeamsFromDatabase();
            response.json(teams);
        }
    }

    return {
        getTeams,
        getTeamsNRFIPercentage
    }
}