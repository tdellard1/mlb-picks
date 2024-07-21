import axios, {AxiosInstance, AxiosResponse} from "axios";
import {Team} from "../../client/common/model/team.interface";
import {TeamSchedule} from "../../client/common/model/team-schedule.interface";
import {BoxScore} from "../../client/common/model/box-score.interface";

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

export function getDailySchedule<T>(gameDate: string): Promise<AxiosResponse<T>> {
  return request.get<T>('/getMLBGamesForDate', {params: {gameDate}});
}

export function getTeams(teamStats: boolean = true, topPerformers: boolean = true): Promise<AxiosResponse<Team[]>> {
  return request.get<Team[]>('/getMLBTeams', {params: {teamStats, topPerformers}});
}

export function getTeamSchedule(teamAbv: string, season: string = '2024'): Promise<AxiosResponse<TeamSchedule>> {
  return request.get<TeamSchedule>('/getMLBTeamSchedule', {params: {teamAbv, season}});
}

export function getBoxScore(gameID: string, startingLineups: boolean = true): Promise<AxiosResponse<BoxScore>> {
  return request.get<BoxScore>('/getMLBBoxScore', {params: {gameID, startingLineups}});
}
