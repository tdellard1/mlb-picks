// db.ts
import Dexie, { Table } from 'dexie';
import {BoxScore} from "../common/model/box.score.model";
import {Team} from "../common/interfaces/team.interface";
import {Roster} from "../common/interfaces/roster";
import {RosterPlayer} from "../common/interfaces/players";
import {Schedule} from "../common/interfaces/team-schedule.interface";

export class AppDB extends Dexie {
  schedules: Table<Schedule, string>;
  teams: Table<Team, string>;
  rosters: Table<Roster, string>;
  boxScores: Table<BoxScore, string>;
  players: Table<RosterPlayer, string>

  constructor() {
    super('mlb-picks');
    this.version(4).stores({
      schedules: 'team',
      teams: 'teamAbv, teamName, teamCity',
      rosters: 'team',
      boxScores: 'gameID, home, away, gameStatus',
      players: 'playerID, team',
    });
  }
}

export const db: AppDB = new AppDB();