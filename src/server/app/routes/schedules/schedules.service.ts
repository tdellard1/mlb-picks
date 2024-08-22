import {exists, getFromCache, replaceInCache} from "../../services/cache.service.js";
import {downloadFileWithType, uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {Team} from "../../models/teams/teams.model.js";
import {getSchedule} from "../../services/tank-01.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";

const key: string = 'schedules';

// Write-through Strategy
export async function updateSchedules(teams: Team[]): Promise<Schedule[]> {
    const teamAbbreviations: string[] = teams.map(({teamAbv}) => teamAbv);
    const schedules: any[] = await retrieveSchedulesFromTank01(teamAbbreviations);

    if (schedules) {
        const lengthInCache: number = await replaceSchedulesInCache(schedules);

        if (lengthInCache > 0) {
            await addSchedulesToDatabase(schedules);
        }
    }

    return schedules;
}

export async function addSchedulesToDatabase(schedules: Schedule[]) {
    await uploadFile(key, schedules);
}

export async function replaceSchedulesInCache(schedules: any[]): Promise<number> {
    const stringifySchedules: string[] = schedules.map((roster: any) => JSON.stringify(roster, null, 0));
    return await replaceInCache(key, stringifySchedules);
}

export async function haveSchedules(): Promise<boolean> {
    const length: number = await exists(key);
    return length === 1;
}


export async function retrieveSchedulesFromCache(): Promise<Schedule[]> {
    return getFromCache(key, Schedule);
}

export async function retrieveSchedulesFromDatabase(): Promise<Schedule[]> {
    return downloadFileWithType(key, Schedule);
}

// Using any to get all properties in case model object doesn't have it
export async function retrieveSchedulesFromTank01(teamAbbreviations: string[]): Promise<any[]> {
    const schedulesPromises: Promise<AxiosResponse<any>>[] =
        teamAbbreviations.map((teamAbbreviation: string) => getSchedule(teamAbbreviation));
    const schedulesResolvers: AxiosResponse<any>[] = await Promise.all(schedulesPromises);
    return schedulesResolvers.map(({data}: AxiosResponse<any>) => data);
}