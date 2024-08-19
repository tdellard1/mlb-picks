// db.ts
import Dexie, { Table } from 'dexie';
import {BoxScore} from "@common/model/box.score.model";

export class AppDB extends Dexie {
  boxScores: Table<BoxScore, string>;

  constructor() {
    super('mlb-picks');
    this.version(5).stores({
      boxScores: 'gameID, home, away, gameStatus',
    });
  }
}

export const db: AppDB = new AppDB();