import {TeamSchedule} from "../team-schedule.interface";
import {Game} from "../game.interface";
import {PlayerStats} from "../player-stats.interface";
import {sum} from "../../utils/general.utils";
import {ensure} from "../../utils/array.utils";
import {BaseModel} from "./base-model";

export class StrikeOutsPerGame extends BaseModel {
  constructor(schedules: TeamSchedule[]) {
    super(schedules);
    this.functionToGetRequiredData = this.getStatValueForTeam;
    this.initData();
  }

  private getStatValueForTeam({team, schedule}: TeamSchedule, numberOfGames: number): number {
    const gamesToUse: Game[] = schedule.slice(0, numberOfGames);
    const strikeoutsForGames: number[] = getListOfStrikeoutsForAllGames(gamesToUse, team);

    return Number((sum(strikeoutsForGames) / numberOfGames).toFixed(2));
  }
}

export function getStrikeoutsForGame(game: Game, desiredTeam: string) {
  const playerStats: any = game?.boxScore?.playerStats;
  const playersOnTeam: PlayerStats[] = [];

  for (let playerStatsKey in playerStats) {
    if ((playerStats[playerStatsKey] as PlayerStats).team === desiredTeam) {
      playersOnTeam.push(playerStats[playerStatsKey]);
    }
  }

  const playerStrikeOuts: number[] = playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.SO));

  return sum(playerStrikeOuts);
}

export function getListOfStrikeoutsForAllGames(games: Game[], team: string) {
  return games.map((game: Game) => {
    return getStrikeoutsForGame(game, team);
  });
}
