import {Team} from "../models/teams/teams.model.js";
import {updateRosters} from "../routes/rosters/rosters.service.js";
import {getAndUpdateTeams} from "../routes/teams/teams.service.js";
import {gameIDsWithoutBoxScores, updateSchedules} from "../routes/schedules/schedules.service.js";
import {updatePlayers} from "../routes/players/players.service.js";
import {BoxScore} from "../models/boxScores/box-scores.model.js";
import {getFromCache} from "../services/cache.service.js";
import {Game} from "../models/schedules/games/game.model.js";
import {getDailySchedule} from "../services/tank-01.service.js";
import {AxiosResponse} from "axios";
import {
    writeThroughBoxScores
} from "../routes/boxScores/box-score.service.js";

export async function quarterDailyUpdate(): Promise<void> {
    const teams: Team[] = await getAndUpdateTeams();
    await updateSchedules(teams);
    await updateRosters(teams);
    await updatePlayers();
}

export async function halfDailyUpdate(): Promise<void> {
    const boxScoresToRequest: string[] = [];
    let needToUpdate: boolean = false;

    const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');

    // TODO: convert this to do only games with live - in progress status
    // const uncompletedBoxScores: string[] = boxScores
    //     .filter(({gameStatus}) => !!gameStatus)
    //     .filter(({gameStatus}) => gameStatus !== 'Completed')
    //     .map(({gameStatus}) => gameStatus!);

    const updateNeeded: boolean = await gamesFromYesterday(boxScoresToRequest, boxScores, getDailySchedule);

    if (updateNeeded) needToUpdate = true;

    const updateNeededAgain: boolean = await scheduleGamesWithoutBoxScores(boxScoresToRequest, boxScores, gameIDsWithoutBoxScores);
    if (updateNeededAgain) needToUpdate = true;

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