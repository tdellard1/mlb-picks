import {Team} from "../models/teams/teams.model.js";
import {updateRosters} from "../routes/rosters/rosters.service.js";
import {getAndUpdateTeams} from "../routes/teams/teams.service.js";
import {gameIDsWithoutBoxScores, updateSchedules} from "../routes/schedules/schedules.service.js";
import {updatePlayers} from "../routes/players/players.service.js";
import {BoxScore} from "../models/boxScores/box-scores.model.js";
import {getFromCache} from "../services/cache.service.js";
import {Game} from "../models/schedules/games/game.model.js";
import {getDailySchedule, getSchedule} from "../services/tank-01.service.js";
import {AxiosResponse} from "axios";
import {
    boxScoresIncludeDate,
    getBoxScores,
    removeDuplicates,
    writeThroughBoxScores
} from "../routes/boxScores/box-score.service.js";
import {Schedule} from "../models/schedules/schedule.model.js";

export async function quarterDailyUpdate(): Promise<void> {
    const teams: Team[] = await getAndUpdateTeams();
    await updateSchedules(teams);
    await updateRosters(teams);
    await updatePlayers();
}

export async function halfDailyUpdate(): Promise<void> {
    const boxScoresToRequest: string[] = [];
    let needToUpdate: boolean = false;

    await writeThroughBoxScores(boxScoresToRequest);

    // const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
    // const uncompletedBoxScores: string[] = boxScores
    //     .filter(({gameStatus}) => !!gameStatus)
    //     .filter(({gameStatus}) => gameStatus !== 'Completed')
    //     .map(({gameID}) => gameID);
    //
    // await gamesFromYesterday(needToUpdate, boxScoresToRequest, boxScores, getDailySchedule);
    // await scheduleGamesWithoutBoxScores(needToUpdate, boxScoresToRequest, boxScores, gameIDsWithoutBoxScores);
    //
    // if (uncompletedBoxScores.length > 0) {
    //     needToUpdate = true;
    //     boxScoresToRequest.push(...uncompletedBoxScores);
    // }
    //
    // if (needToUpdate && boxScoresToRequest.length > 0) {
    //     await writeThroughBoxScores(boxScoresToRequest);
    // }
}

function getYesterday(): string {
    const today: number = new Date().setHours(0, 0, 0, 0);
    const yesterday: Date = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return yesterday.toISOString().split('T')[0].split('-').join('');
}

async function gamesFromYesterday(needToUpdate: boolean, boxScoresToGet: string[], boxScores: BoxScore[], getDailySchedule: (gameDate: string) => Promise<AxiosResponse<Game[]>>) {
    const today: number = new Date().setHours(0, 0, 0, 0);
    const dateToConvert: Date = new Date(today);
    dateToConvert.setDate(dateToConvert.getDate() - 1);

    const yesterday: string = yyyyMMdd(dateToConvert);

    const hasBoxScoreFromYesterday: boolean = boxScores.some(({gameDate}) => gameDate === yesterday);

    if (hasBoxScoreFromYesterday) {
        const {data}: AxiosResponse<Game[]> = await getDailySchedule(yesterday);
        boxScoresToGet.push(...data.map(({gameID}) => gameID));
        needToUpdate = true;
    }
}

async function scheduleGamesWithoutBoxScores(needToUpdate: boolean, boxScoresToRequest: string[], boxScores: BoxScore[], gameIDsWithoutBoxScores: (boxScores: BoxScore[]) => Promise<string[]>) {
    const gamesMissingBoxScores: string[] = await gameIDsWithoutBoxScores(boxScores);

    if (gamesMissingBoxScores.length > 0) {
        boxScoresToRequest.push(...gamesMissingBoxScores);
        needToUpdate = true;
    }
}

export function yyyyMMdd(date: Date) {
    return date.toISOString().split('T')[0].split('-').join('');
}