/*
 {
  "fantasyProsLink": "https://www.fantasypros.com/mlb/players/yainer-diaz-c.php",
  "jerseyNum": "21",
  "yahooLink": "https://sports.yahoo.com/mlb/players/12435",
  "sleeperBotID": "2611",
  "fantasyProsPlayerID": "45200",
  "mlbID": "673237",
  "lastGamePlayed": "20240727_LAD@HOU",
  "espnLink": "https://www.espn.com/mlb/player/_/id/4781491",
  "yahooPlayerID": "12435",
  "bat": "R",
  "pos": "C",
  "teamID": "11",
  "injury": {},
  "mlbIDFull": "yainer-diaz-673237",
  "rotoWirePlayerIDFull": "yainer-diaz-17190",
  "rotoWirePlayerID": "17190",
  "height": "6-0",
  "espnHeadshot": "https://a.espncdn.com/i/headshots/mlb/players/full/4781491.png",
  "espnID": "4781491",
  "firstSeen": "20240709",
  "mlbLink": "https://www.mlb.com/player/yainer-diaz-673237",
  "mlbHeadshot": "https://img.mlbstatic.com/mlb-photos/image/upload/d_people:generic:headshot:silo:current.png/r_max/w_180,q_auto:best/v1/people/673237/headshot/silo/current",
  "weight": "195",
  "team": "HOU",
  "teamAbv": "HOU",
  "throw": "R",
  "bDay": "9/21/1998",
  "cbsPlayerID": "2829012",
  "longName": "Yainer Diaz",
  "playerID": "673237",
  "stats": {},
  "college": "Millersville, Millersville, PA",
  "highSchool": "Capital Christian, Sacramento, CA",
  "espnName": "Jonathan Singleton",
  "cbsLongName": "Trey Cabbage",
  "cbsPlayerIDFull": "3103463/trey-cabbage/",
  "mlbShortName": "Julks"
}
* */

import {Injury} from "./injury.model.js";
import {RosterPlayerStats} from "./stats/roster-player-stats.model.js";

export interface Player {
    longName: string;
}

export class RosterPlayer {
    allGamesSaved!: boolean;
    bDay!: string;
    bat!: string;
    cbsLongName!: string
    cbsPlayerID!: string;
    cbsPlayerIDFull!: string;
    college!: string
    espnHeadshot!: string;
    espnID!: string;
    espnLink!: string;
    espnName!: string;
    fantasyProsLink!: string;
    fantasyProsPlayerID!: string;
    firstSeen!: string;
    height!: string;
    injury!: Injury;
    jerseyNum!: string;
    lastGamePlayed!: string;
    longName!: string;
    mlbHeadshot!: string;
    mlbID!: string;
    mlbIDFull!: string;
    mlbLink!: string;
    playerID!: string;
    pos!: string;
    rotoWirePlayerID!: string;
    rotoWirePlayerIDFull!: string;
    sleeperBotID!: string;
    team!: string;
    teamAbv!: string;
    teamID!: string;
    throw!: string;
    weight!: string;
    yahooLink!: string;
    yahooPlayerID!: string;
    stats!: RosterPlayerStats;


    constructor(data?: any) {
        if (data) {
            this.allGamesSaved = data.allGamesSaved;
            this.bDay = data.bDay;
            this.bat = data.bat;
            this.cbsLongName = data.cbsLongName;
            this.cbsPlayerID = data.cbsPlayerID;
            this.cbsPlayerIDFull = data.cbsPlayerIDFull;
            this.college = data.college;
            this.espnHeadshot = data.espnHeadshot;
            this.espnID = data.espnID;
            this.espnLink = data.espnLink;
            this.espnName = data.espnName;
            this.fantasyProsLink = data.fantasyProsLink;
            this.fantasyProsPlayerID = data.fantasyProsPlayerID;
            this.firstSeen = data.firstSeen;
            this.height = data.height;
            this.injury = data.injury;
            this.jerseyNum = data.jerseyNum;
            this.lastGamePlayed = data.lastGamePlayed;
            this.longName = data.longName;
            this.mlbHeadshot = data.mlbHeadshot;
            this.mlbID = data.mlbID;
            this.mlbIDFull = data.mlbIDFull;
            this.mlbLink = data.mlbLink;
            this.playerID = data.playerID;
            this.pos = data.pos;
            this.rotoWirePlayerID = data.rotoWirePlayerID;
            this.rotoWirePlayerIDFull = data.rotoWirePlayerIDFull;
            this.sleeperBotID = data.sleeperBotID;
            this.team = data.team;
            this.teamAbv = data.teamAbv;
            this.teamID = data.teamID;
            this.weight = data.weight;
            this.yahooLink = data.yahooLink;
            this.yahooPlayerID = data.yahooPlayerID;
            this.stats = data.stats;
            this.throw = data.throw;
        }
    }
}



























