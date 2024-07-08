import {Game} from "../model/game.interface";

export class AnalysisUtils {
  static gamesBeforeToday({gameTime_epoch}: Game): boolean {
    const beginningOfToday: number = new Date().setHours(0, 0, 0, 0);
    const dateOfGame: number = new Date(Number(gameTime_epoch) * 1000).getTime();

    return dateOfGame < beginningOfToday;
  }
}
