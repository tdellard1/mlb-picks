import {PlayerStats} from "../../common/model/player-stats.interface";
import {GameStats} from "../../common/model/game-stats.interface";
/*
export class PlayerInfo {
  bDay: string;
  bat: string;
  cbsPlayerID: string;
  espnHeadshot: string;
  espnID: string;
  espnLink: string;
  fantasyProsLink: string;
  fantasyProsPlayerID: string;
  height: string;
  highSchool: string;
  injury: Injury;
  jerseyNum: string;
  lastGamePlayed: string;
  longName: string;
  mlbHeadshot: string;
  mlbID: string;
  mlbIDFull: string;
  mlbLink: string;
  playerID: string;
  pos: string;
  rotoWirePlayerID: string;
  rotoWirePlayerIDFull: string;
  sleeperBotID: string;
  stats: PlayerInfoStats;
  team: string;
  teamAbv: string;
  teamID: string;
  weight: string;
  yahooLink: string;
  yahooPlayerID: string;


  constructor(bDay: string,
              bat: string,
              cbsPlayerID: string,
              espnHeadshot: string,
              espnID: string,
              espnLink: string,
              fantasyProsLink: string,
              fantasyProsPlayerID: string,
              height: string,
              highSchool: string,
              injury: Injury,
              jerseyNum: string,
              lastGamePlayed: string,
              longName: string,
              mlbHeadshot: string,
              mlbID: string,
              mlbIDFull: string,
              mlbLink: string,
              playerID: string,
              pos: string,
              rotoWirePlayerID: string,
              rotoWirePlayerIDFull: string,
              sleeperBotID: string,
              stats: PlayerInfoStats,
              team: string,
              teamAbv: string,
              teamID: string,
              yahooLink: string,
              yahooPlayerID: string,
              weight: string) {
    this.bDay = bDay;
    this.bat = bat;
    this.cbsPlayerID = cbsPlayerID;
    this.espnHeadshot = espnHeadshot;
    this.espnID = espnID;
    this.espnLink = espnLink;
    this.fantasyProsLink = fantasyProsLink;
    this.fantasyProsPlayerID = fantasyProsPlayerID;
    this.height = height;
    this.highSchool = highSchool;
    this.injury = injury;
    this.jerseyNum = jerseyNum;
    this.lastGamePlayed = lastGamePlayed;
    this.longName = longName;
    this.mlbHeadshot = mlbHeadshot;
    this.mlbID = mlbID;
    this.mlbIDFull = mlbIDFull;
    this.mlbLink = mlbLink;
    this.playerID = playerID;
    this.pos = pos;
    this.rotoWirePlayerID = rotoWirePlayerID;
    this.rotoWirePlayerIDFull = rotoWirePlayerIDFull;
    this.sleeperBotID = sleeperBotID;
    this.stats = stats;
    this.team = team;
    this.teamAbv = teamAbv;
    this.teamID = teamID;
    this.weight = weight;
    this.yahooLink = yahooLink;
    this.yahooPlayerID = yahooPlayerID;
    // this.throw = throw;
  }
}
*/

export interface PlayerInfo {
  bDay: string;
  bat: string;
  cbsPlayerID: string;
  espnHeadshot: string;
  espnID: string;
  espnLink: string;
  fantasyProsLink: string;
  fantasyProsPlayerID: string;
  height: string;
  highSchool: string;
  injury: Injury;
  jerseyNum: string;
  lastGamePlayed: string;
  longName: string;
  mlbHeadshot: string;
  mlbID: string;
  mlbIDFull: string;
  mlbLink: string;
  playerID: string;
  pos: string;
  rotoWirePlayerID: string;
  rotoWirePlayerIDFull: string;
  sleeperBotID: string;
  stats: PlayerInfoStats;
  team: string;
  teamAbv: string;
  teamID: string;
  throw: string;
  weight: string;
  yahooLink: string;
  yahooPlayerID: string;
}

export interface Injury {
  description: string;
  injDate: string;
  designation: string;
}

export interface PlayerInfoStats extends GameStats {
  gamesPlayed: string;
  gamesStarted: string;
  team: string;
  teamAbv: string;
  teamID: string;
}
