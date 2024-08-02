import {TeamSchedule} from "./team-schedule.interface";
import {AverageRunsPerGame} from "./league-rankings/average-runs-per-game";
import {LeagueRanking} from "./average-runs-per-game.interface";
import {Game} from "./game.interface";
import {PlayerStats} from "./player-stats.interface";
import {BattingAveragePerGame} from "./league-rankings/batting-average-per-game.model";
import {StrikeOutsPerGame} from "./league-rankings/strikeout-average-per-game.model";
import {PlayersStats} from "./box-score.interface.js";

export class AnalysisData {
  averageRunsPerGameModel: AverageRunsPerGame;
  battingAverageModel: BattingAveragePerGame;
  strikeoutModel: StrikeOutsPerGame;

  constructor(allSchedules: TeamSchedule[]) {
    this.averageRunsPerGameModel = new AverageRunsPerGame(allSchedules);
    this.battingAverageModel = new BattingAveragePerGame(allSchedules);
    this.strikeoutModel = new StrikeOutsPerGame(allSchedules);
  }
}

export class BattingAverageModel {
  battingAveragePerGameTeam: BattingAveragePerGameTeam = {};
  battingAveragePerGameLeague: BattingAveragePerGameLeague = {};

  constructor(schedules: TeamSchedule[]) {
    const numberOfGames: number = 15;
    if (!schedules) throw new Error('All Schedules must be defined');

    if (this.allSchedulesHaveSameNAmountOfGames(schedules, numberOfGames)) {
      for (let i: number = 1; i < numberOfGames + 1; i++) {
        // this.battingAveragePerGameLeague[i] = this.leagueRankingRPGPerAmountOfGames(allSchedules, i);
      }
    }

    console.log('BattingAverageModel: ', schedules);
    const games: Game[] = schedules.map(value => value.schedule).flat();

    games.forEach(game => {
      if (game?.gameID === '20240623_SF@STL') {
        const playerStats: PlayersStats | undefined = game?.boxScore?.playerStats;
        const playersOnHomeTeam: PlayerStats[] = [];
        for (const playerStatsKey in playerStats) {
          if ((playerStats[playerStatsKey] as PlayerStats).team === "STL") {
            playersOnHomeTeam.push(playerStats[playerStatsKey]);
          }
        }

        const playersAtBats: number[] = playersOnHomeTeam.map((playerStats: PlayerStats) => Number(playerStats.Hitting.AB));
        console.log('atBats: ', playersAtBats, playersAtBats.reduce((a, b) => a + b, 0));
        console.log('batting average: ', (Number(game.boxScore?.teamStats['home'].Hitting.H) / Number(playersAtBats.reduce((a, b) => a + b, 0))).toFixed(3));
      }
    })
  }

  private allSchedulesHaveSameNAmountOfGames(schedules: TeamSchedule[], numberOfGames: number): boolean {
    const allSchedulesHaveCorrectNumberOfGamesOrMore: boolean = schedules.every(({schedule}: TeamSchedule) => schedule.length >= numberOfGames);
    const allSchedulesGamesHaveSameAmountOfGames: boolean = new Set(schedules.map(({schedule}: TeamSchedule) => schedule.length)).size === 1;

    return allSchedulesGamesHaveSameAmountOfGames && allSchedulesHaveCorrectNumberOfGamesOrMore;
  }

  // private leagueRankingRPGPerAmountOfGames(schedules: TeamSchedule[], n: number): LeagueRanking[] {
  //   return schedules
  //     .sort((a, b) => {
  //       const aTeamAverageRunsPerGameInLastN: number = this.averageRunsPerGameInLastNumberOfGames(a, n);
  //       const bTeamAverageRunsPerGameInLastN: number = this.averageRunsPerGameInLastNumberOfGames(b, n);
  //
  //       return aTeamAverageRunsPerGameInLastN - bTeamAverageRunsPerGameInLastN;
  //     })
  //     .reverse()
  //     .map((teamSchedule: TeamSchedule, index: number) => {
  //       return {
  //         team: teamSchedule.team,
  //         rank: String(index + 1),
  //         value: this.averageRunsPerGameInLastNumberOfGames(teamSchedule, n).toFixed(2),
  //       } as LeagueRanking
  //     });
  // }

  // private averageRunsPerGameInLastNumberOfGames(teamSchedule: TeamSchedule, numberOfGames: number): number {
  //   const totalRuns: number = this.totalRunsInLastNumberOfGames(teamSchedule, numberOfGames);
  //   return Math.round((totalRuns / numberOfGames) * 100) / 100;
  // }
  //
  // private totalRunsInLastNumberOfGames({team, schedule}: TeamSchedule, numberOfGames: number): number {
  //   const listOfTotalRunsForGames: number[] =this.listOfRunsInLastNumberOfGames(team, schedule, numberOfGames);
  //   return listOfTotalRunsForGames.reduce((a, b) => a + b, 0);
  // }

  // private listOfBattingAverageInLastNumberOfGames(team: string, games: Game[], numberOfGames: number): string[] {
  //   const lastAmountOfGames: Game[] = this.lastNumberOfGames(games, numberOfGames);
  //   return lastAmountOfGames.map(({away, home, boxScore}: Game) => {
  //     // const {home, away}: BoxScore = ensure(boxScore?.teamStats);
  //     if (away === team) {
  //       return boxScore?.teamStats.away.Hitting.avg;
  //     } else if (home === team) {
  //       return boxScore?.teamStats.home.Hitting.avg;
  //     } else {
  //       throw new TypeError('Team is not home or away: ' + team);
  //     }
  //   })
  // }

  private lastNumberOfGames(games: Game[], n: number): Game[] {
    return games.slice(0, n);
  }
}

export class BattingAveragePerGameTeam {
  [teams: string]: Map<number, number>;
}

export class BattingAveragePerGameLeague {
  [runs: string]: LeagueRanking[];
}
