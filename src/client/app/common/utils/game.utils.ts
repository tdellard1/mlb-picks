import {Game} from "../interfaces/game";

export class GameUtils {
  public static get sortGames() {
    return (a: Game, b: Game): number => {
      const chronologicalOrder: number = Number(a.gameTime_epoch) - Number(b.gameTime_epoch);
      const alphabeticalOrder: number = a.away > b.away ? 1 : -1;

      return chronologicalOrder || alphabeticalOrder;
    }
  }
}