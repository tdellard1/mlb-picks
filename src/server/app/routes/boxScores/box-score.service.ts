import {addToCache, exists, getFromCache, replaceInCache} from "../../services/cache.service.js";
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {downloadFileWithType, uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {getBoxScore} from "../../services/tank-01.service.js";
import {Team} from "../../models/teams/teams.model.js";
import {Roster} from "../../models/players/rosters.model.js";
const key: string = 'boxScores';

export async function haveBoxScores(): Promise<boolean> {
    const length: number = await exists(key);
    return length > 0;
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

export async function writeThroughBoxScores(gameIDs: string[]) {
    let newBoxScores: BoxScore[] = [];

    if (gameIDs.length > 0) {
        const boxScorePromises: Promise<AxiosResponse<BoxScore>>[] = gameIDs.map((gameID: string) => getBoxScore(gameID));
        const boxScoreResolvers: AxiosResponse<BoxScore>[] = await Promise.all(boxScorePromises);
        newBoxScores = boxScoreResolvers.map(({data}) => data);
    }

    const oldBoxScores: BoxScore[] = await retrieveBoxScoresFromDatabase();
    const allBoxScores: BoxScore[] = [...newBoxScores, ...oldBoxScores];
    const uniqueBoxScores: BoxScore[] = removeDuplicates(allBoxScores);

    const length: number = await replaceBoxScoresInCache(uniqueBoxScores);
    if (length > 0) {
        await addBoxScoresToDatabase(uniqueBoxScores);
    }
}

export async function replaceBoxScoresInCache(boxScores: BoxScore[]): Promise<number> {
    const stringifyBoxScores: string[] = boxScores.map((boxScore: BoxScore) => JSON.stringify(boxScore, null, 0));
    return await replaceInCache(key, stringifyBoxScores, 'set');
}

export async function addBoxScoresToDatabase(boxScores: BoxScore[]): Promise<void> {
    await uploadFile(key, boxScores); 
}

export async function getCachedBoxScores(): Promise<BoxScore[]> {
    return await getFromCache(key, BoxScore, 'set');
}

export async function getBoxScores(): Promise<BoxScore[]> {
    return await downloadFileWithType(key, BoxScore);
}

export async function addBoxScoresToCache(boxScores: BoxScore[]): Promise<number> {
    const stringifyBoxScores: string[] = boxScores.map((boxScore: BoxScore) => JSON.stringify(boxScore, null, 0));
    return await addToCache(key, stringifyBoxScores);
}

export async function retrieveBoxScoresFromTank01(gameIDs: string[]): Promise<BoxScore[]> {
    const rostersPromises: Promise<AxiosResponse<BoxScore>>[] =
        gameIDs.map((teamAbbreviation: string) => getBoxScore<BoxScore>(teamAbbreviation));
    const rostersResolvers: AxiosResponse<BoxScore>[] = await Promise.all(rostersPromises);
    return rostersResolvers.map(({data}: AxiosResponse<BoxScore>) => data);
}

export async function retrieveBoxScoresFromDatabase(): Promise<BoxScore[]> {
    return downloadFileWithType(key, BoxScore);
}

export async function boxScoresIncludeDate(boxScores: BoxScore[], yyyyMMdd: string): Promise<boolean> {
    const dates: string[] = boxScores.map(({gameDate}) => gameDate);
    const uniqueDatesInBoxScores: Set<string> = new Set(dates);

    return uniqueDatesInBoxScores.has(yyyyMMdd);
}
