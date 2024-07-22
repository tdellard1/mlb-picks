import {getBoxScore, getDailySchedule, getTeams, getTeamSchedule} from '../singletons/tank01Service.js'
import {AxiosResponse} from "axios";
import {uploadFile} from "../singletons/firebase.js";
import {Team} from "../../client/common/model/team.interface";
import {listAddAll, remove, getList, setLastUpdated} from "../singletons/redis.js";
import {TeamSchedule} from "../../client/common/model/team-schedule.interface";
import {UploadStatus} from "../models/upload-status.js";
import {Game} from "../../client/common/model/game.interface";
import {BoxScore} from "../../client/common/model/box-score.interface";


export const dailyUpdate = async () => {
  const teamsKey: string = 'teams'
  const teamsResponse: AxiosResponse<Team[]> = await getTeams();
  const teams: Team[] = teamsResponse.data;
  const {uploaded ,reason}: UploadStatus = await uploadFile(teamsKey, teams);
  if (uploaded) {
    await remove(teamsKey);
    const added: number = await listAddAll(teamsKey, teams.map((team: Team) => JSON.stringify(team)));
    if (added) {
      setLastUpdated(teamsKey, added);
    }
  }

  await updateSchedules(teams);

  const yyyyMMdd: string = getYesterdayAsYYYYMMDD();
  await updateBoxScores(yyyyMMdd);
}

async function updateBoxScores(yyyyMMdd: string): Promise<UploadStatus> {
  const dailyScheduleResponse: AxiosResponse<Game[]> = await getDailySchedule<Game[]>(yyyyMMdd);
  const games: Game[] = dailyScheduleResponse.data;
  const gameIDs: string[] = games.map(({gameID}) => gameID);
  console.log('gameIDs', gameIDs, gameIDs.length);

  const boxScoresKey: string = 'boxScores';
  const promises: Promise<AxiosResponse<BoxScore>>[] = gameIDs.map((gameID: string) => getBoxScore(gameID));
  const resolved: AxiosResponse<BoxScore>[] = await Promise.all(promises);
  const boxScores: BoxScore[] = resolved.map((response: AxiosResponse<BoxScore>) => response.data);

  const previousBoxScoresListOfStrings: string[] = await getList(boxScoresKey);
  const previousBoxScores: BoxScore[] = previousBoxScoresListOfStrings.map((boxScoreString: string) => JSON.parse(boxScoreString));

  previousBoxScores.push(...boxScores);

  console.log(previousBoxScores.length);

  const {uploaded, reason}: UploadStatus = await uploadFile(boxScoresKey, previousBoxScores);
  console.log(`${boxScoresKey} UploadStatus: `, {uploaded, reason});
  if (uploaded) {
    await remove(boxScoresKey);
    const added: number = await listAddAll(boxScoresKey, previousBoxScores.map((schedule: BoxScore) => JSON.stringify(schedule)));
    console.log('added: ', added);
  }
  return {uploaded, reason} as UploadStatus
}

async function updateSchedules(teams: Team[]): Promise<UploadStatus> {
  const schedulesKey: string = 'schedules'

  const promises: Promise<AxiosResponse<TeamSchedule>>[] = teams.map(({teamAbv}: Team) => getTeamSchedule(teamAbv));
  const resolved: AxiosResponse<TeamSchedule>[] = await Promise.all(promises);
  const teamSchedules: TeamSchedule[] = resolved.map((response: AxiosResponse<TeamSchedule>) => response.data);

  const {uploaded, reason}: UploadStatus = await uploadFile(schedulesKey, teamSchedules);
  console.log(`${schedulesKey} UploadStatus: `, {uploaded, reason});
  if (uploaded) {
    await remove(schedulesKey);
    const added: number = await listAddAll(schedulesKey, teamSchedules.map((schedule: TeamSchedule) => JSON.stringify(schedule)));
    return {uploaded, reason} as UploadStatus;
  } else {
    //  Handle Error
    return {uploaded, reason} as UploadStatus;
  }
}

function getYesterdayAsYYYYMMDD(): string {
  const today: Date = new Date();
  const yesterday: Date = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0].split('-').join('');
}
