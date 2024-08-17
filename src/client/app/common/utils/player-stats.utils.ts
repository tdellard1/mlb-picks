import {PlayerStats} from "../interfaces/player-stats";

export class PlayerStatsUtils {
  public static get sortChronologically () {
    return (gameStatsOne: PlayerStats, gameStatsTwo: PlayerStats): number => {
      const gameDateOne: string = gameStatsOne.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      const aGameDate: Date = new Date(gameDateOne);

      const gameDateTwo: string = gameStatsTwo.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      const bGameDate: Date = new Date(gameDateTwo);

      return aGameDate.getTime() - bGameDate.getTime();
    }
  }
}