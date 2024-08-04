import {Schedule} from "../../../models/schedules/schedule.model.js";
import {BoxScore} from "../../../models/boxScores/box-scores.model.js";
import {Game} from "../../../models/schedules/games/game.model.js";
import {AssertUtils} from "../../../utils/assert.utils.js";
import {addBoxScoresToDatabase, retrieveBoxScoresFromTank01} from "../../../routes/boxScores/box-score.service.js";
import {replaceInCache} from "../../cache.service.js";

export default async function reconcileBoxScores(schedules: Schedule[], allBoxScores: BoxScore[]) {
    const mBoxScores: Map<string, BoxScore> = convertListOfBoxScoresToMap(allBoxScores);
    const recentGamesInSchedule: Schedule[] = convertToScheduleWithMostRecentGames(schedules, mBoxScores);
    const boxScoresToRequest: string[] = getRequiredBoxScores(recentGamesInSchedule);

    if (boxScoresToRequest.length > 0) {
        const boxScores: BoxScore[] = await retrieveBoxScoresFromTank01(boxScoresToRequest);
        await addBoxScoresToMultipleSets(boxScores);
        await addBoxScoresToSingleSet(boxScores, allBoxScores);
    }
}

function convertListOfBoxScoresToMap(boxScores: BoxScore[]): Map<string, BoxScore> {
    const boxScoresLength: number = boxScores.length;
    const map: Map<string, BoxScore> = new Map<string, BoxScore>();

    for (let i: number = 0; i < boxScoresLength; i++) {
        const boxScore: BoxScore = boxScores[i];
        map.set(boxScore.gameID, boxScore);
    }

    return map;
}

function convertToScheduleWithMostRecentGames(schedules: Schedule[], mBoxScores: Map<string, BoxScore>): Schedule[] {
    return schedules.map((schedule: Schedule) => {
        const games: Game[] = Schedule.get15MostRecentGames(schedule);

        AssertUtils.assertLength(games, 15);

        schedule.schedule = games.slice().map((game: Game) => {
            const hasBoxScore: boolean = mBoxScores.has(game.gameID);
            if (hasBoxScore) {
                game.boxScore = mBoxScores.get(game.gameID)!;
            }

            return game;
        });

        return schedule;
    });
}

function getRequiredBoxScores(schedules: Schedule[]): string[] {
    const allGames: Game[] = schedules.map(({schedule}) => schedule).flat();
    return allGames
        .filter(({gameStatus}) => gameStatus === 'Completed')
        .filter(({boxScore}) => !boxScore)
        .map(({gameID}) => gameID);
}

async function addBoxScoresToSingleSet(newBoxScores: BoxScore[], oldBoxScores: BoxScore[]) {
    const allBoxScores: BoxScore[] = [...newBoxScores, ...oldBoxScores];
    const uniqueBoxScores: BoxScore[] = removeDuplicates(allBoxScores);

    const stringifyBoxScores: string[] = uniqueBoxScores.map((boxScore: BoxScore) => JSON.stringify(boxScore));
    const length: number = await replaceInCache('boxScores', stringifyBoxScores);

    if (length > 0) {
        return await addBoxScoresToDatabase(uniqueBoxScores);
    }
}


async function addBoxScoresToMultipleSets(boxScores: BoxScore[]): Promise<number[]> {
    const redisUpdateRequests: Promise<number>[] = boxScores.map(async (boxScore: BoxScore) =>
    replaceInCache(`boxScore:${boxScore.gameID}`, JSON.stringify(boxScore)));

    return await Promise.all(redisUpdateRequests);
}

export function removeDuplicates(boxScores: BoxScore[]): BoxScore[] {
    const uniqueBoxScores: BoxScore[] = [];
    const boxScoreLength: number = boxScores.length;

    for (let i: number = 0; i < boxScoreLength; i++) {
        const boxScoreInQuestion: BoxScore = boxScores[i];
        const boxScoreInQuestionIndex: number = uniqueBoxScores.findIndex(({gameID}) => gameID === boxScoreInQuestion.gameID);

        if (boxScoreInQuestionIndex === -1) {
            uniqueBoxScores.push(boxScoreInQuestion);
        } else if (boxScoreInQuestion.gameStatus === 'Completed') {
            uniqueBoxScores[boxScoreInQuestionIndex] = boxScoreInQuestion;
        }
    }

    return uniqueBoxScores;
}
/*
export async function halfDailyUpdate(): Promise<void> {
    const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
    const schedules: Schedule[] = await getFromCache('schedules', Schedule, 'set');

    await reconcileBoxScores(schedules, boxScores);
}

export async function reSaveBoxScores() {
     const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
     const boxScores: BoxScore[] = await downloadFileWithType<BoxScore>('boxScores', BoxScore);

     const boxScoreStrings: string[] = boxScores.map((boxScore: BoxScore) => JSON.stringify(boxScore));

     const result: number = await replaceInCache('boxScores', boxScoreStrings);
     console.log('result: ', result);


    // From MultipleSets of boxscores to database
 const schedules: Schedule[] = await getFromCache('schedules', Schedule, 'set');

 console.log('schedules: ', schedules.length);

 const gameIDs: string[] = schedules.map(({schedule}: Schedule) => schedule).flat().map(({gameID}) => gameID);
 const uniqueGameIds: Set<string> = new Set(gameIDs);

 console.log('gameIDs: ', gameIDs.length);
 console.log('uniqueGameIds: ', uniqueGameIds.size);

 const boxScoresCacheRequests: Promise<BoxScore[]>[] = [];
 const uniqueGameIdentifiers: string[] = [...uniqueGameIds];
 const size: number = uniqueGameIdentifiers.length;

 for (let i: number = 0; i < size; i++) {
     const key: string = `boxScore:${uniqueGameIdentifiers[i]}`;
     const length: number = await exists(key);
     console.log('length: ', length, i);

     if (length > 0) {
         boxScoresCacheRequests.push(getFromCache<BoxScore>(key, BoxScore, 'set'));
     }
 }

 console.log('boxScoresCacheRequests: ', boxScoresCacheRequests.length);

 const boxScores: BoxScore[][] = await Promise.all(boxScoresCacheRequests);

 await uploadFile<BoxScore[]>('boxScores', boxScores.flat());
}
 */