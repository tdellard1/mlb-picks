/*
{
  "gamesStarted": "90",
  "Fielding": {},
  "gamesPlayed": "92",
  "Hitting": {},
  "BaseRunning": {},
  "longName": "Yainer Diaz",
  "teamID": "11",
  "teamAbv": "HOU",
  "team": "HOU",
  "Pitching": {}
}
 */

import {RosterPlayerPitching} from "./pitching.model.js";
import {RosterPlayerBaseRunning} from "./base-running.model.js";
import {RosterPlayerHitting} from "./hitting.model.js";
import {RosterPlayerFielding} from "./fielding.model.js";

export interface RosterPlayerStats {
    gamesStarted: string;
    Fielding: RosterPlayerFielding;
    gamesPlayed: string;
    Hitting: RosterPlayerHitting;
    BaseRunning: RosterPlayerBaseRunning;
    longName: string;
    teamID: string;
    teamAbv: string;
    team: string;
    Pitching: RosterPlayerPitching;
}