import {Game} from "../interfaces/game";
import {GameStatus} from "../constants/game-status";

export class GameUtils {
  public static get sortGames() {
    return (a: Game, b: Game): number => {
      const chronologicalOrder: number = Number(a._gameTime_epoch) - Number(b._gameTime_epoch);
      const alphabeticalOrder: number = a.away > b.away ? 1 : -1;

      return chronologicalOrder || alphabeticalOrder;
    }
  }

  public static get completedGames() {
    return (game: Game): boolean => {
      return game.gameStatus === GameStatus.Completed;
    }
  }
}