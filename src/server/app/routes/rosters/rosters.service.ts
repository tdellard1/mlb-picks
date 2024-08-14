import {addToCache, exists, getFromCache, replaceInCache} from "../../services/cache.service.js";
import {Roster} from "../../models/players/rosters.model.js";
import {downloadFileWithType, uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {getRoster} from "../../services/tank-01.service.js";
import {Team} from "../../models/teams/teams.model.js";
import {TaskState} from "@firebase/storage";

const key: string = 'rosters';

// Write-through Strategy
export async function updateRosters(teams: Team[]): Promise<void> {
    const teamAbbreviations: string[] = teams.map(({teamAbv}) => teamAbv);
    const rosters: Roster[] = await retrieveRostersFromTank01(teamAbbreviations);
    if (rosters && rosters.length === teams.length && rosters.length === 30) {
        const lengthInCache: number = await replaceRostersInCache(rosters);

        if (lengthInCache > 0) {
            const result: TaskState = await addRostersToDatabase(rosters);
            console.log('Result of database upload for rosters is ', result);
        }
    } else {
        throw new Error('Rosters didn\'t match count of MLB Teams');
    }
}

export async function addRostersToDatabase(rosters: Roster[]) {
    return await uploadFile(key, rosters);
}

export async function replaceRostersInCache(rosters: Roster[]): Promise<number> {
    const stringifyRosters: string[] = rosters.map((roster: Roster) => JSON.stringify(roster, null, 0));
    return await replaceInCache(key, stringifyRosters);
}

export async function retrieveRostersFromTank01(teamAbbreviations: string[]): Promise<Roster[]> {
    const rostersPromises: Promise<AxiosResponse<Roster>>[] =
        teamAbbreviations.map((teamAbbreviation: string) => getRoster(teamAbbreviation));
    const rostersResolvers: AxiosResponse<Roster>[] = await Promise.all(rostersPromises);
    return rostersResolvers.map(({data}: AxiosResponse<Roster>) => data);
}