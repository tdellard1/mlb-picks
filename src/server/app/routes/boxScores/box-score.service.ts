import {replaceInCache} from "../../services/cache.service.js";
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {getBoxScore} from "../../services/tank-01.service.js";

const key: string = 'boxScores';

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

export async function writeThroughBoxScores(gameIDs: string[], oldBoxScores: BoxScore[]) {
    const boxScorePromises: Promise<AxiosResponse<BoxScore>>[] = gameIDs.map((gameID: string) => getBoxScore(gameID));
    const boxScoreResolvers: AxiosResponse<BoxScore>[] = await Promise.all(boxScorePromises);
    const newBoxScores: BoxScore[] = boxScoreResolvers.map(({data}) => data);

    const allBoxScores: BoxScore[] = [...newBoxScores, ...oldBoxScores];
    const uniqueBoxScores: BoxScore[] = removeDuplicates(allBoxScores);

    const length: number = await replaceBoxScoresInCache(uniqueBoxScores);
    const lengthTwo: number[] = await addBoxScoresToMultipleSets(uniqueBoxScores);

    if (length > 0 && lengthTwo.every(value => value === 1)) {
        console.log('length: ', length);
        console.log('lengthTwo: ', new Set(lengthTwo));
        await addBoxScoresToDatabase(uniqueBoxScores);
    }
}

export async function replaceBoxScoresInCache(boxScores: BoxScore[]): Promise<number> {
    const stringifyBoxScores: string[] = boxScores.map((boxScore: BoxScore) => JSON.stringify(boxScore, null, 0));
    return await replaceInCache(key, stringifyBoxScores);
}

export async function addBoxScoresToDatabase(boxScores: BoxScore[]): Promise<void> {
    await uploadFile(key, boxScores);
}

export async function retrieveBoxScoresFromTank01(gameIDs: string[]): Promise<BoxScore[]> {
    const rostersPromises: Promise<AxiosResponse<BoxScore>>[] =
        gameIDs.map((teamAbbreviation: string) => getBoxScore<BoxScore>(teamAbbreviation));
    const rostersResolvers: AxiosResponse<BoxScore>[] = await Promise.all(rostersPromises);
    return rostersResolvers.map(({data}: AxiosResponse<BoxScore>) => data);
}

async function addBoxScoresToMultipleSets(boxScores: BoxScore[]): Promise<number[]> {
    const redisUpdateRequests: Promise<number>[] = boxScores.map(async (boxScore: BoxScore) =>
        replaceInCache(`boxScore:${boxScore.gameID}`, JSON.stringify(boxScore)));

    return await Promise.all(redisUpdateRequests);
}