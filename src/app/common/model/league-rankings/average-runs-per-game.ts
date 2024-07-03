import {TeamSchedule} from "../team-schedule.interface";
import {AverageRunsPerGameLeague, AverageRunsPerGameTeam, LeagueRanking} from "../average-runs-per-game.interface";
import {Game, LineScore} from "../game.interface";
import {ensure} from "../../utils/array.utils";

export class AverageRunsPerGame {
  Team: AverageRunsPerGameTeam = {};
  League: AverageRunsPerGameLeague = {};

  constructor(allSchedules: TeamSchedule[]) {
    const numberOfGames: number = 15;
    if (!allSchedules) throw new Error('All Schedules must be defined');
    if (this.allSchedulesHaveSameNAmountOfGames(allSchedules, numberOfGames)) {
      for (let i: number = 1; i < numberOfGames + 1; i++) {
        this.League[i] = this.leagueRankingRPGPerAmountOfGames(allSchedules, i);
      }
    } else {
      throw new Error('All Schedules must have 15 games minimum');
    }

    const allTeams: string[] = allSchedules.map(({team}: TeamSchedule) => team);
    for (const team of allTeams) {
      this.Team[team] = new Map<number, number>();

      for (let i: number = 1; i < numberOfGames + 1; i++) {
        const teamSchedule: TeamSchedule = ensure(allSchedules.find((teamSchedule: TeamSchedule) => teamSchedule.team === team));
        const averageRunsPerGame: number = this.averageRunsPerGameInLastNumberOfGames(teamSchedule, i);
        this.Team[team].set(i, averageRunsPerGame);
      }
    }
  }

  getTeamsLeagueRanking(team: string, numberOfGames: number, prop: string): string | number {
    return ensure(this.League[numberOfGames]
      .find((leagueRanking: LeagueRanking) => leagueRanking.team === team))[prop];
  }

  getTeamsRPGAverage(team: string, numberOfGames: number): number {
    return Number(ensure(this.Team[team].get(numberOfGames)));
  }

  private allSchedulesHaveSameNAmountOfGames(allSchedules: TeamSchedule[], N: number): boolean {
    return allSchedules.every(({schedule}: TeamSchedule) => schedule.length >= N) &&
      new Set(allSchedules.map(({schedule}: TeamSchedule) => schedule.length)).size === 1;
  }

  private leagueRankingRPGPerAmountOfGames(schedules: TeamSchedule[], n: number): LeagueRanking[] {
    return schedules
      .sort((a, b) => {
        const aTeamAverageRunsPerGameInLastN: number = this.averageRunsPerGameInLastNumberOfGames(a, n);
        const bTeamAverageRunsPerGameInLastN: number = this.averageRunsPerGameInLastNumberOfGames(b, n);

        return aTeamAverageRunsPerGameInLastN - bTeamAverageRunsPerGameInLastN;
      })
      .reverse()
      .map((teamSchedule: TeamSchedule, index: number) => {
        return {
          team: teamSchedule.team,
          rank: String(index + 1),
          value: this.averageRunsPerGameInLastNumberOfGames(teamSchedule, n).toFixed(2),
        } as LeagueRanking
      });
  }

  private averageRunsPerGameInLastNumberOfGames(teamSchedule: TeamSchedule, numberOfGames: number): number {
    const totalRuns: number = this.totalRunsInLastNumberOfGames(teamSchedule, numberOfGames);
    return Math.round((totalRuns / numberOfGames) * 100) / 100;
  }

  private totalRunsInLastNumberOfGames({team, schedule}: TeamSchedule, numberOfGames: number): number {
    const listOfTotalRunsForGames: number[] =this.listOfRunsInLastNumberOfGames(team, schedule, numberOfGames);
    return listOfTotalRunsForGames.reduce((a, b) => a + b, 0);
  }

  private listOfRunsInLastNumberOfGames(team: string, games: Game[], numberOfGames: number): number[] {
    const lastAmountOfGames: Game[] = this.lastNumberOfGames(games, numberOfGames);
    return lastAmountOfGames.map(({boxScore}: Game) => {
      const {home, away}: LineScore = ensure(boxScore?.lineScore);
      if (home.team === team) {
        return Number(home.R);
      } else if (away.team === team) {
        return Number(away.R);
      } else {
        throw new TypeError('Team is not home or away: ' + team);
      }
    });
  }

  private lastNumberOfGames(games: Game[], n: number): Game[] {
    return games.slice(0, n);
  }
}
