import {Team} from "../models/teams/teams.model.js";
import {updateRosters} from "../routes/rosters/rosters.service.js";
import {getAndUpdateTeams} from "../routes/teams/teams.service.js";
import {gameIDsWithoutBoxScores, updateSchedules} from "../routes/schedules/schedules.service.js";
import {updatePlayers} from "../routes/players/players.service.js";
import {BoxScore, GameStatus, hasGameDate} from "../models/boxScores/box-scores.model.js";
import {getFromCache} from "../services/cache.service.js";
import {Game} from "../models/schedules/games/game.model.js";
import {getDailySchedule} from "../services/tank-01.service.js";
import {AxiosResponse} from "axios";
import {writeThroughBoxScores} from "../routes/boxScores/box-score.service.js";
import {Schedule} from "../models/schedules/schedule.model.js";

export async function quarterDailyUpdate(): Promise<void> {
    const teams: Team[] = await getAndUpdateTeams();
    await updateSchedules(teams);
    await updateRosters(teams);
    await updatePlayers();
}

export async function reconcileBoxScores() {
    const preExisting: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
    const schedules: Schedule[] = await getFromCache('schedules', Schedule, 'set');


    const inProgress: string[] = preExisting
        .filter(({gameStatus}) => gameStatus === GameStatus.Live)
        .map(({gameID}) => gameID)

    const absent: string[] = schedules
        .map(({schedule}) => schedule).flat()
        .filter(({gameStatus}) => gameStatus === GameStatus.Completed)
        .filter((game) => !preExisting.some(({gameID}) => game.gameID === gameID))
        .map(({gameID}) => gameID);

    const hasGamesFromYesterday: boolean = preExisting
        .filter(hasGameDate)
        .some(BoxScore.isFromYesterday);

    console.log('inProgress: ', inProgress);
    console.log('missingBoxScores: ', absent);
    console.log('hasGamesFromYesterday: ', hasGamesFromYesterday, preExisting.filter(hasGameDate).filter(BoxScore.isFromYesterday));
}


export async function halfDailyUpdate(): Promise<void> {
    const boxScoresToRequest: string[] = [];
    let needToUpdate: boolean = false;

    const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');

    // TODO: convert this to do only games with live - in progress status
    const uncompletedBoxScores: string[] = boxScores
        .filter(({gameStatus}) => !!gameStatus)
        .filter(({gameStatus}) => gameStatus === 'Live - In Progress')
        .map(({gameID}) => gameID!);

    if (uncompletedBoxScores.length > 0) {
        boxScoresToRequest.push(...uncompletedBoxScores);
        needToUpdate = true;
    }

    const updateNeeded: boolean = await gamesFromYesterday(boxScoresToRequest, boxScores, getDailySchedule);
    if (updateNeeded) needToUpdate = true;

    const updateNeededAgain: boolean = await scheduleGamesWithoutBoxScores(boxScoresToRequest, boxScores, gameIDsWithoutBoxScores);
    if (updateNeededAgain) needToUpdate = true;

    console.log('needToUpdate: ', needToUpdate);
    console.log('boxScoresToRequest: ', boxScoresToRequest.length);

    if (needToUpdate && boxScoresToRequest.length > 0) {
        await writeThroughBoxScores(boxScoresToRequest);
    }
}

async function gamesFromYesterday(boxScoresToGet: string[], boxScores: BoxScore[], getDailySchedule: (gameDate: string) => Promise<AxiosResponse<Game[]>>) {
    const today: number = new Date().setHours(0, 0, 0, 0);
    const dateToConvert: Date = new Date(today);
    dateToConvert.setDate(dateToConvert.getDate() - 1);

    const yesterday: string = yyyyMMdd(dateToConvert);

    const hasBoxScoreFromYesterday: boolean = boxScores.some(({gameDate}) => gameDate === yesterday);
    console.log('hasBoxScoreFromYesterday: ', hasBoxScoreFromYesterday, boxScores.filter(({gameDate}) => gameDate === yesterday).length);

    if (!hasBoxScoreFromYesterday) {
        const {data}: AxiosResponse<Game[]> = await getDailySchedule(yesterday);
        boxScoresToGet.push(...data.map(({gameID}) => gameID));
        return true;
    }

    return false;
}

async function scheduleGamesWithoutBoxScores(boxScoresToRequest: string[], boxScores: BoxScore[], gameIDsWithoutBoxScores: (boxScores: BoxScore[]) => Promise<string[]>) {
    const gamesMissingBoxScores: string[] = await gameIDsWithoutBoxScores(boxScores);

    if (gamesMissingBoxScores.length > 0) {
        boxScoresToRequest.push(...gamesMissingBoxScores);
        return true;
    }

    return false;
}

export function yyyyMMdd(date: Date) {
    return date.toISOString().split('T')[0].split('-').join('');
}