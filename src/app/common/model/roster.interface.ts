import {
  Injury,
  TeamBaseRunningStats,
  TeamFieldingStats,
  TeamHittingStats,
  TeamPitchingStats,
} from "./team-stats.interface";
import {PlayerStats} from "./player-stats.interface";
import {Player} from "./players.interface";

export interface Roster {
  team: string;
  roster: RosterPlayer[];
}

export interface RosterPlayer extends Player{
  fantasyProsLink: string;
  jerseyNum: string;
  yahooLink: string;
  sleeperBotID: string;
  fantasyProsPlayerID: string;
  mlbID: string;
  lastGamePlayed: string;
  espnLink: string;
  yahooPlayerID: string;
  bat: string;
  pos: string;
  // teamID: string;
  mlbIDFull: string;
  rotoWirePlayerIDFull: string;
  rotoWirePlayerID: string;
  height: string;
  espnHeadshot: string;
  espnID: string;
  mlbLink: string;
  mlbHeadshot: string;
  weight: string;
  // team: string;
  teamAbv: string;
  throw: string;
  bDay: string;
  cbsPlayerID: string;
  // longName: string;
  // playerID: string;
  stats: RosterTeamStats;
  injury: Injury;
  games?: PlayerStats[];
  gamesMap?: Map<string, PlayerStats>;
  allGamesSaved: boolean;
}

export interface RosterTeamStats {
  Pitching: TeamPitchingStats;
  BaseRunning: TeamBaseRunningStats;
  Fielding: TeamFieldingStats;
  Hitting: TeamHittingStats;
  gamesPlayed: string;
  gamesStarted: string;
  team: string;
  teamAbv: string;
  teamID: string;
}
