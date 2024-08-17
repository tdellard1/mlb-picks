import {replaceInCache} from "../../services/cache.service.js";
import {uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {Team} from "../../models/teams/teams.model.js";
import {getTeams} from "../../services/tank-01.service.js";

const key: string = 'teams';

// Write-through Strategy
export async function getAndUpdateTeams(): Promise<Team[]> {
    const teams: Team[] = await retrieveTeamsFromTank01();
    if (teams) {
        const lengthInCache: number = await replaceTeamsInCache(teams);

        if (lengthInCache > 0) {
            await addTeamsToDatabase(teams);
            return teams;
        }

        return teams;
    }

    return teams;
}

export async function addTeamsToDatabase(teams: Team[]) {
    return await uploadFile(key, teams);
}

export async function replaceTeamsInCache(teams: Team[]): Promise<number> {
    const stringifyTeams: string[] = teams.map((roster: Team) => JSON.stringify(roster, null, 0));
    return await replaceInCache(key, stringifyTeams);
}

export async function retrieveTeamsFromTank01(): Promise<Team[]> {
    const {data}: AxiosResponse<Team[]> = await getTeams();
    return data;
}