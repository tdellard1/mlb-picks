import {Team} from "../models/teams/teams.model.js";
import {updateRosters} from "../routes/rosters/rosters.service.js";
import {getAndUpdateTeams} from "../routes/teams/teams.service.js";
import {updateSchedules} from "../routes/schedules/schedules.service.js";
import {updatePlayers} from "../routes/players/players.service.js";
import {BoxScore} from "../models/boxScores/box-scores.model.js";
import {addToCache, getFromCache, replaceInCache} from "../services/cache.service.js";
import {Game} from "../models/schedules/games/game.model.js";
import {getBoxScore, getDailySchedule} from "../services/tank-01.service.js";
import {replaceBoxScoresInCache, writeThroughBoxScores} from "../routes/boxScores/box-score.service.js";
import {Schedule} from "../models/schedules/schedule.model.js";
import {AxiosResponse} from "axios";
import {getClient, RedisClient} from "../clients/redis-client.js";

export async function quarterDailyUpdate(): Promise<void> {
    const teams: Team[] = await getAndUpdateTeams();
    await updateSchedules(teams);
    await updateRosters(teams);
    await updatePlayers();
}

export async function reconcileBoxScores() {
    const preExisting: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
    const schedules: Schedule[] = await getFromCache('schedules', Schedule, 'set');
    const absent: string[] = schedules
        .map(({schedule}) => schedule).flat()
        .filter(Game.isCompleted)
        .filter(Game.notContainedWithin(preExisting))
        .map(Game.toGameID);

    const inProgress: string[] = preExisting
        .filter(BoxScore.isGameInProgress)
        .map(BoxScore.toGameID);

    const hasGamesFromYesterday: boolean = preExisting
        .filter(BoxScore.hasGameDate)
        .some(BoxScore.isFromYesterday);

    let slateYesterday: string[] = [];

    if (hasGamesFromYesterday) {
        const yyyyMMdd: string = getYesterdayDate();

        const completedYesterday: Game[] = await getDailySchedule(yyyyMMdd);
        slateYesterday = completedYesterday.map(Game.toGameID);
    }

    if (slateYesterday.length > 0 || absent.length > 0 || inProgress.length > 0) {
        const gameIDs: Set<string> = new Set<string>([...slateYesterday, ...absent, ...inProgress]);
        console.log('preExisting: ', preExisting.length);
        console.log('slateYesterday: ', slateYesterday.length);
        console.log('absent: ', absent.length);
        console.log('inProgress: ', inProgress.length);
        await writeThroughBoxScores([...gameIDs], preExisting);
    }
}

export async function placeHolder(): Promise<void> {
    // From tank01 to boxScore Cache list
    // const schedules: Schedule[] = await getFromCache('schedules', Schedule, 'set');
    // const gameIDs: Set<string> = new Set<string>();
    //
    // schedules.map(({schedule}) => schedule).flat()
    //     .filter(Game.isCompleted)
    //     .sort(Game.sortReverseChronologically)
    //     .map(Game.toGameID)
    //     .forEach(gameIDs.add.bind(gameIDs));
    //
    // const response: AxiosResponse<BoxScore>[] = await Promise.all([...gameIDs].map((gameID: string, index: number) => {
    //     return getBoxScore<any>(gameID);
    // }))
    //
    // const boxScores: BoxScore[] = response.map(({data}) => data);
    //
    // const response2: number = await replaceBoxScoresInCache(boxScores);
    // console.log('response: ', response2);





// From boxScores Cache to other caches
    const cache: RedisClient = getClient();
    const boxScoreStrings: string[] = await cache.sMembers('boxScores');
    const boxScores: any[] = boxScoreStrings.map((boxScoreString: string) => JSON.parse(boxScoreString));

    const teamStatsRequest: Promise<number>[] = boxScores.map((boxScore: any) => replaceInCache(`boxScore:teamStats:${boxScore.gameID}`, JSON.stringify(boxScore.teamStats, null, 0)));
    const playerStatsRequest: Promise<number>[] = boxScores.map((boxScore: any) => replaceInCache(`boxScore:playerStats:${boxScore.gameID}`, JSON.stringify(boxScore.playerStats, null, 0)));
    const boxScoreRequest: Promise<number>[] = boxScores.map((boxScore: any) => replaceInCache(`boxScore:${boxScore.gameID}`, JSON.stringify(boxScore, null, 0)));

    const teamStatsResults: number[] = await Promise.all(teamStatsRequest);
    const playerStatsResults: number[] = await Promise.all(playerStatsRequest);
    const boxScoreResults: number[] = await Promise.all(boxScoreRequest);

    const teamStatsSet: Set<number> = new Set<number>(teamStatsResults);
    const playerStatsSet: Set<number> = new Set<number>(playerStatsResults);
    const boxScoreSet: Set<number> = new Set<number>(boxScoreResults);


    console.log('teamStatsSet: ', teamStatsSet);
    console.log('playerStatsSet: ', playerStatsSet);
    console.log('boxScoreSet: ', boxScoreSet);
}

function getYesterdayDate(): string {
    const yesterday: Date = new Date(new Date().setHours(0, 0, 0, 0));
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0].split('-').join('');
}