import {NextFunction, Request, Response} from 'express';
import {RosterPlayer} from "../../models/players/roster-player.model.js";
import {RedisClient} from "../../clients/redis-client.js";
import {Schedule} from "../../models/schedules/schedule.model.js";
import {PitcherUtils} from "../../utils/pitcher.utils.js";
import {BoxScore, GameStatus} from "../../models/boxScores/box-scores.model.js";
import {Game} from "../../models/schedules/games/game.model.js";
import {AxiosResponse} from "axios";
import {getBoxScore} from "../../services/tank-01.service.js";

export declare type PlayersController = {
    fetchPlayersFromCache: (request: Request, response: Response, next: NextFunction) => Promise<void>,
    fetchPlayerFromCache: (request: Request, response: Response, next: NextFunction) => Promise<void>,
    getPitcherStats: (request: Request, response: Response, next: NextFunction) => Promise<void>
};

export function playersController(redis: RedisClient): PlayersController {
    const cacheClient: RedisClient = redis;

    function getPitcherNRFIStats(rosterPlayer: RosterPlayer, schedules: Schedule[], boxScores: BoxScore[]) {
        let record: string = '';
        let streak: string = '';
        let pitcher: string = '';

        if (!rosterPlayer) {
            console.log('No player found: ', rosterPlayer);
        }

        if (rosterPlayer && rosterPlayer.games) {
            const pitcherUtils: PitcherUtils = new PitcherUtils(schedules, boxScores);

            pitcher = rosterPlayer.longName;
            record = pitcherUtils.getNoRunsFirstInningRecord(rosterPlayer);
            streak = pitcherUtils.getNoRunsFirstInningStreak(rosterPlayer);
        } else {
            pitcher = rosterPlayer.longName;
            record = '0';
            streak = '0';
            console.log('Player has no games ', rosterPlayer);
        }

        return {
            record,
            streak,
            pitcher
        }
    }

    async function getBoxScoresForMissingStats(schedules: Schedule[]): Promise<BoxScore[]> {
        const games: Game[] = schedules.map(({schedule}) => schedule).flat();
        const completedLackingLineScore: string[] = games.filter(({gameStatus, lineScore}) => gameStatus === GameStatus.Suspended && lineScore === undefined).map(Game.toGameID);

        const boxScorePromises: Promise<AxiosResponse<BoxScore>>[] = completedLackingLineScore.map((gameID: string) => getBoxScore(gameID));
        const boxScoreResolvers: AxiosResponse<BoxScore>[] = await Promise.all(boxScorePromises);
        return boxScoreResolvers.map(({data}) => new BoxScore(data));
    }

    /* ------------------------------------------------------------------------ */
    /*                          API EndPoint Methods                            */
    /* ------------------------------------------------------------------------ */
    const fetchPlayersFromCache = async (request: Request, response: Response, next: NextFunction) => {
        const exists: boolean = await cacheClient.exists('players') > 0;
        if (!exists) next();

        const playerStringSet: string[] = await cacheClient.sMembers('players');
        const players: RosterPlayer[] = playerStringSet.map((playerString) => JSON.parse(playerString));

        response.json(players);
    }

    const fetchPlayerFromCache = async (request: Request, response: Response, next: NextFunction) => {
        const playerId: string = request.params['playerId'];
        const key: string = `player:${playerId}`;

        const exists: boolean = await cacheClient.exists(key) > 0;
        if (!exists) next();

        const playerString: string[] = await cacheClient.sMembers(key);
        const player: RosterPlayer = new RosterPlayer(JSON.parse(playerString[0]));

        response.json(player);
    }

    const getPitcherStats = async (request: Request, response: Response) => {
        const playerIds: string[] = request.query['playerIds'] as string[];

        const playersRequests: Promise<string[]>[] = playerIds.map((playerId: string) => cacheClient.sMembers(`player:${playerId}`));
        const playerResponses: string[][] = await Promise.all(playersRequests);
        const pitchersStrings: string[] = playerResponses.flat();
        const allPitchers: RosterPlayer[] = pitchersStrings.map((pitcher) => new RosterPlayer(JSON.parse(pitcher)));

        const cacheResults: string[] = await cacheClient.sMembers('schedules');
        const schedules: Schedule[] = cacheResults.map((scheduleString: string) => new Schedule(JSON.parse(scheduleString)));

        const boxScores: BoxScore[] = await getBoxScoresForMissingStats(schedules);

        const pitcherStats: any = {};

        for (const pitcher of allPitchers) {
            pitcherStats[pitcher.playerID] = getPitcherNRFIStats(pitcher, schedules, boxScores);
        }

        response.json(pitcherStats);
    }

    return {
        fetchPlayersFromCache,
        fetchPlayerFromCache,
        getPitcherStats
    }
}