import {
  getBoxScore,
  getDailySchedule,
  getPlayers,
  getRoster,
  getTeams,
  getTeamSchedule
} from '../singletons/tank01Service.js'
import {AxiosResponse} from "axios";
import {uploadFile} from "../singletons/firebase.js";
import {Team} from "../../client/common/model/team.interface.js";
import {listAddAll, remove, getList, setLastUpdated} from "../singletons/redis.js";
import {TeamSchedule} from "../../client/common/model/team-schedule.interface.js";
import {UploadStatus} from "../models/upload-status.js";
import {Game} from "../../client/common/model/game.interface.js";
import {BoxScore} from "../../client/common/model/box-score.interface.js";
import {Roster, RosterPlayer} from "../../client/common/model/roster.interface.js";
import {PlayerStats} from "../../client/common/model/player-stats.interface.js";
import {Tank01Date} from "../../client/common/utils/date.utils.js";


export const dailyUpdate = async () => {
  console.log('starting Daily Update');
  const yyyyMMdd: string = getYesterdayAsYYYYMMDD();
  const dailyScheduleResponse: AxiosResponse<Game[]> = await getDailySchedule<Game[]>(yyyyMMdd);
  const games: Game[] = dailyScheduleResponse.data;
  const gameIDs: string[] = games.map(({gameID}) => gameID);

  /** ----------------------------------------------------*/
  /** --------------------- Box Scores ------------------*/
  /** --------------------------------------------------*/
  const boxScoresKey: string = 'boxScores';
  const boxScoresPromises: Promise<AxiosResponse<BoxScore>>[] = gameIDs.map((gameID: string) => getBoxScore(gameID));
  const boxScoresResolvers: AxiosResponse<BoxScore>[] = await Promise.all(boxScoresPromises);
  const newBoxScores: BoxScore[] = boxScoresResolvers.map(({data}: AxiosResponse<BoxScore>) => data);

  const previousBoxScoresListOfStrings: string[] = await getList(boxScoresKey);
  const previousBoxScores: BoxScore[] = previousBoxScoresListOfStrings.map((boxScoreString: string) => JSON.parse(boxScoreString));

  const allBoxScores: BoxScore[] = [...previousBoxScores, ...newBoxScores];

  const boxScores: BoxScore[] = removeInvalidBoxScores(allBoxScores);

  const boxScoresUploadStatus: UploadStatus = await uploadFile(boxScoresKey, allBoxScores);
  console.log('boxScoresUploadStatus', boxScoresUploadStatus);
  if (boxScoresUploadStatus.uploaded) {
    await remove(boxScoresKey);
    const added: number = await listAddAll(boxScoresKey, boxScores.map((schedule: BoxScore): string => JSON.stringify(schedule)));
    console.log(`${boxScoresKey} added to Redis: ${added}`);
    if (added) {
      setLastUpdated(boxScoresKey, added);
    }
  }

  /** ------------------------------------------------*/
  /** --------------------- Teams -------------------*/
  /** ----------------------------------------------*/
  const teams: Team[] = (await getTeams()).data;

  const teamsKey: string = 'teams';

  const teamsUploadStatus: UploadStatus = await uploadFile(teamsKey, teams);
  console.log('teamsUploadStatus', teamsUploadStatus);
  if (teamsUploadStatus.uploaded) {
    await remove(teamsKey);
    const added: number = await listAddAll(teamsKey, teams.map((team: Team) => JSON.stringify(team)));
    console.log(`${teamsKey} added to Redis: ${added}`);
    if (added) {
      setLastUpdated(teamsKey, added);
    }
  }

  /** --------------------------------------------------*/
  /** --------------------- Rosters -------------------*/
  /** ------------------------------------------------*/
  const players: RosterPlayer[] = (await getPlayers()).data;
  const rosterPromises: Promise<AxiosResponse<Roster>>[] = teams.map(({teamAbv}: Team) => getRoster(teamAbv));
  const rosterResolvers: AxiosResponse<Roster>[] = await Promise.all(rosterPromises);
  const rosters: Roster[] = rosterResolvers.map((response: AxiosResponse<Roster>) => response.data);

  const allRosterPlayers: RosterPlayer[] = rosters.map(({roster}) => roster).flat();
  const allPlayerStats: PlayerStats[] = previousBoxScores.map(({playerStats}) => {
    if (playerStats) {
      return Object.values(playerStats);
    } else {
      return [];
    }
  }).flat();

  const newRosters: RosterPlayer[] = players.map((player: RosterPlayer) => {
     const playerStats: PlayerStats[] = allPlayerStats
       .filter(({playerID}) => playerID === player.playerID)
       .sort((a: PlayerStats, b: PlayerStats) => {
         const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
         const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

         return aDateObject.timeStamp - bDateObject.timeStamp;
       });

     const playerIndex: number = allRosterPlayers.findIndex(({playerID}) => player.playerID === playerID);

     if (playerIndex !== -1) {
       const newPlayer: RosterPlayer = allRosterPlayers[playerIndex];
       newPlayer.games = playerStats;
       return newPlayer;
     } else {
       player.games = playerStats;
       return player;
     }
  });

  const rostersKey: string = 'rosters';

  const rosterPlayersUploadStatus: UploadStatus = await uploadFile(rostersKey, newRosters);
  console.log('rosterPlayersUploadStatus: ', rosterPlayersUploadStatus);
  if (rosterPlayersUploadStatus.uploaded) {
    await remove(rostersKey);
    const added: number = await listAddAll(rostersKey, newRosters.map((player: RosterPlayer) => JSON.stringify(player)));
    console.log(`${rostersKey} added to Redis: ${added}`);
    if (added) {
      setLastUpdated(rostersKey, added);
    }
  }

    /** --------------------------------------------------*/
   /** -------------------- Schedules -------------------*/
  /** --------------------------------------------------*/
  const schedulesKey: string = 'schedules'

  const schedulesPromises: Promise<AxiosResponse<TeamSchedule>>[] = teams.map(({teamAbv}: Team) => getTeamSchedule(teamAbv));
  const schedulesResolvers: AxiosResponse<TeamSchedule>[] = await Promise.all(schedulesPromises);
  const teamSchedules: TeamSchedule[] = schedulesResolvers.map((response: AxiosResponse<TeamSchedule>) => response.data);

  const schedulesUploadStatus: UploadStatus = await uploadFile(schedulesKey, teamSchedules);
  console.log('schedulesUploadStatus', schedulesUploadStatus);
  if (schedulesUploadStatus.uploaded) {
    await remove(schedulesKey);
    const added: number = await listAddAll(schedulesKey, teamSchedules.map((schedule: TeamSchedule) => JSON.stringify(schedule)));
    console.log(`${schedulesKey} added to Redis: ${added}`);
    if (added) {
      setLastUpdated(schedulesKey, added);
    }
  }
}

function getYesterdayAsYYYYMMDD(): string {
  const today: Date = new Date();
  const yesterday: Date = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0].split('-').join('');
}

function removeInvalidBoxScores(boxScores: BoxScore[]) {
  const returnArray: BoxScore[] = [];
  const listOfBoxScoreGameIDs: string[] = [];
  const boxScoreLength: number = boxScores.length;

  for (let i: number = 0; i < boxScoreLength; i++) {
    if (!listOfBoxScoreGameIDs.includes(boxScores[i].gameID)) {
      returnArray.push(boxScores[i]);
      listOfBoxScoreGameIDs.push(boxScores[i].gameID);
    }
  }

  return returnArray;
}
