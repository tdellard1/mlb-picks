import {Game} from "../interfaces/game";
import {GameStatus} from "../constants/game-status";

export class GameUtils {
  public static get sortGames() {
    return (a: Game, b: Game): number => {
      let chronologicalOrder: number = 0;
      if (a.gameTime_epoch && b.gameTime_epoch)  {
        chronologicalOrder = Number(a.gameTime_epoch) - Number(b.gameTime_epoch);
      } else if (a._gameTime_epoch && b._gameTime_epoch) {
        chronologicalOrder = Number(a._gameTime_epoch) - Number(b._gameTime_epoch);
      }

      const alphabeticalOrder: number = a.away > b.away ? 1 : -1;
      return chronologicalOrder || alphabeticalOrder;
    }
  }

  public static get gameCompleted() {
    return (game: Game): boolean => {
      return game.gameStatus === GameStatus.Completed;
    }
  }
}