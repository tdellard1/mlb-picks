import axios, {AxiosInstance, AxiosResponse} from "axios";
import {RosterPlayer} from "../models/players/roster-player.model";
import {Roster} from "../models/players/rosters.model.js";
import {Team} from "../models/teams/teams.model.js";
import {Schedule} from "../models/schedules/schedule.model.js";

const request: AxiosInstance   = axios.create({
    baseURL: 'https://tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': 'e22845af99mshf6b3ec01f4d7666p1c7ce7jsne4ce7518ae06',
        'X-RapidAPI-Host': 'tank01-mlb-live-in-game-real-time-statistics.p.rapidapi.com'
    },
    transformResponse: data => {
        return JSON.parse(data).body;
    }
});

export function getPlayers(): Promise<AxiosResponse<RosterPlayer[]>> {
    return request.get<RosterPlayer[]>('/getMLBPlayerList');
}

export function getRoster(teamAbv: string, getStats: boolean = true): Promise<AxiosResponse<Roster>> {
    return request.get<Roster>('/getMLBTeamRoster', {params: {teamAbv, getStats}});
}

export function getTeams(teamStats: boolean = true, topPerformers: boolean = true): Promise<AxiosResponse<Team[]>> {
    return request.get<Team[]>('/getMLBTeams', {params: {teamStats, topPerformers}});
}

export function getSchedule(teamAbv: string, season: string = '2024'): Promise<AxiosResponse<Schedule>> {
    return request.get<Schedule>('/getMLBTeamSchedule', {params: {teamAbv, season}});
}

export function getBoxScore<T>(gameID: string, startingLineups: boolean = true): Promise<AxiosResponse<T>> {
    return request.get<T>('/getMLBBoxScore', {params: {gameID, startingLineups}});
}

export function getDailySchedule<T>(gameDate: string): Promise<AxiosResponse<T>> {
    return request.get<T>('/getMLBGamesForDate', {params: {gameDate}});
}