import {Team} from "../models/teams/teams.model.js";
import {updateRosters} from "../routes/rosters/rosters.service.js";
import {getAndUpdateTeams} from "../routes/teams/teams.service.js";
import {updateSchedules} from "../routes/schedules/schedules.service.js";
import {updatePlayers} from "../routes/players/players.service.js";
import {BoxScore} from "../models/boxScores/box-scores.model.js";
import {getFromCache} from "../services/cache.service.js";
import {Game} from "../models/schedules/games/game.model.js";
import {getDailySchedule} from "../services/tank-01.service.js";
import {writeThroughBoxScores} from "../routes/boxScores/box-score.service.js";
import {Schedule} from "../models/schedules/schedule.model.js";
import {setNeedToUpdate} from "../routes/update/update.service.js";

/**
 * Total Requests Made Per Day:
 * modernizeRosters:
 * 30 - Each Roster,
 * 30 - Each Schedule,
 * 1 - All Teams
 * 1 - All Players
 * Called Every Hour = 24 * (30 + 30 + 1 + 1) = 1488
 * */
export async function modernizeRostersSchedulesAndTeams() {
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
        await writeThroughBoxScores([...gameIDs], preExisting);
        await setNeedToUpdate();
    }
}

function getYesterdayDate(): string {
    const yesterday: Date = new Date(new Date().setHours(0, 0, 0, 0));
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0].split('-').join('');
}