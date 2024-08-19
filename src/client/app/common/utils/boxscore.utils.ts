import {BoxScore} from "../model/box.score.model";
import {GameStatus} from "../constants/game-status";
import {SourceType} from "../../features/Splits/splits/splits.component";
import {Site} from "@common/constants/site";

export class BoxScoreUtils {
  public static basedOnSplits(target: string, opposing: string, source: SourceType, site: Site) {
    return (boxScore: BoxScore): boolean => {
      if (SourceType.Season === source) {
        return true;
      } else if (SourceType.Split === source) {
        return boxScore[site] === target;
      } else if (SourceType.Teams === source) {
        return boxScore[Site.HOME] === target && boxScore[Site.AWAY] === opposing ||
          boxScore[Site.HOME] === opposing && boxScore[Site.AWAY] === target;
      } else {
        throw new Error('Invalid source type')
      }
    }
  }

  public static get sortChronologically() {
    return (boxScore: BoxScore, boxScore2: BoxScore) => {
      const gameDateOne: string = boxScore.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      const aGameDate: Date = new Date(gameDateOne);

      const gameDateTwo: string = boxScore2.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
      const bGameDate: Date = new Date(gameDateTwo);

      return aGameDate.getTime() - bGameDate.getTime();
    }
  }

  public static getTeamStats(team: string) {
    return ({teamStats, away, home}: BoxScore) => {
      if (away === team) {
        return teamStats.away.Hitting;
      } else if (home === team) {
        return teamStats.home.Hitting;
      } else {
        console.log(`Away Team: ${away}, Home Team: ${home}, expected team: ${team}`);
        throw new Error('Home and Away teams don\'t match away team');
      }
    }
  }

  public static getBullpenStatsFor(teamAbv: string) {
    return ({playerStats}: BoxScore) => {
        return playerStats.filter(({team, allPositionsPlayed, Pitching}) =>
          team === teamAbv &&
          allPositionsPlayed === 'P' && Pitching.pitchingOrder !== '1');
    }
  }

  public static get gameCompleted() {
    return ({gameStatus}: BoxScore) => {
        return gameStatus === GameStatus.Completed;
    }
  }
}