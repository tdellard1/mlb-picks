import {sum} from "../utils/general.utils";
import {BaseModel} from "./base-model";
import {Schedule} from "../interfaces/team-schedule.interface";
import {Game} from "../interfaces/game";
import {PlayerStats} from "../interfaces/player-stats";

export class BattingAveragePerGame extends BaseModel {
  constructor(schedules: Schedule[]) {
    super(schedules);
    this.functionToGetRequiredData = this.getStatValueForTeam;
    this.initData();
  }

  private getStatValueForTeam({team, schedule}: Schedule, numberOfGames: number): number {
    const gamesToUse: Game[] = schedule.slice(0, numberOfGames);
    const averageBattingAverageForGames: number[] = getListOfBattingAverageForAllGames(gamesToUse, team);

    return Number((sum(averageBattingAverageForGames) / numberOfGames).toFixed(3));
  }
}

export function getBattingAverageForGame(game: Game, desiredTeam: string) {
  const playerStats: any = game?.boxScore?.playerStats;
  const playersOnTeam: PlayerStats[] = [];

  for (const playerStatsKey in playerStats) {
    if ((playerStats[playerStatsKey] as PlayerStats).team === desiredTeam) {
      playersOnTeam.push(playerStats[playerStatsKey]);
    }
  }

  const playersAtBats: number[] = playersOnTeam.map(({Hitting}: PlayerStats) => Number(Hitting.AB));
  const teamsTotalAtBats: number = sum(playersAtBats);
  let teamHits: number;

  if (desiredTeam === game.away) {
    teamHits = Number(game.boxScore?.teamStats['away'].Hitting.H);
  } else if (desiredTeam === game.home) {
    teamHits = Number(game.boxScore?.teamStats['home'].Hitting.H);
  } else {
    throw new Error('Team doesn\'t match');
  }

  return teamHits / teamsTotalAtBats;
}

export function getListOfBattingAverageForAllGames(games: Game[], team: string) {
  return games.map((game: Game) => {
    return getBattingAverageForGame(game, team);
  });
}
