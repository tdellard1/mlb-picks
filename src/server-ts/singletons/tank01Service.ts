import axios, {AxiosInstance, AxiosResponse} from "axios";

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

export function getTeams<T>(teamStats: boolean = true, topPerformers: boolean = true): Promise<AxiosResponse<T>> {
  return request.get<T>('/getMLBTeams', {params: {teamStats, topPerformers}});
}

export function getTeamSchedule<T>(teamAbv: string, season: string = '2024'): Promise<AxiosResponse<T>> {
  return request.get<T>('/getMLBTeamSchedule', {params: {teamAbv, season}});
}

export function getBoxScore<T>(gameID: string, startingLineups: boolean = true): Promise<AxiosResponse<T>> {
  return request.get<T>('/getMLBBoxScore', {params: {gameID, startingLineups}});
}
