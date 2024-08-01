
import {TeamSchedule} from "../team-schedule.interface";
import {LeagueRanking} from "../average-runs-per-game.interface";
import {ensure} from "../../utils/array.utils";

export class BaseModel {
  Team: {[teams: string]: Map<number, number>} = {};
  League: {[games: string]: LeagueRanking[]} = {};
  numberOfGames: number = 15;
  schedules: TeamSchedule[];
  allTeams: string[];

  functionToGetRequiredData: Function = () => {};

  constructor(schedules: TeamSchedule[], numberOfGames?: number) {
    if (numberOfGames) this.numberOfGames = numberOfGames;
    if (!schedules) throw new Error('All Schedules must be defined');

    if (!this.allSchedulesHaveSameNAmountOfGames(schedules, this.numberOfGames))
      throw new Error('All schedules don\'t meet criteria to get stats');

    this.schedules = schedules;
    this.allTeams = schedules.map(({team}: TeamSchedule) => team);

    this.allTeams.forEach((team: string) => {
      this.Team[team] = new Map<number, number>();
    });
  }

  initData() {
    for (let currentGameCount: number = 1; currentGameCount < this.numberOfGames + 1; currentGameCount++) {
      this.League[currentGameCount] = this.listRankingTeams(this.schedules, currentGameCount);
    }

    for (const team of this.allTeams) {
      for (let i: number = 1; i < this.numberOfGames + 1; i++) {
        const teamSchedule: TeamSchedule = ensure(this.schedules.find((teamSchedule: TeamSchedule) => teamSchedule.team === team));
        const averageRunsPerGame: number = this.functionToGetRequiredData(teamSchedule, i);
        this.Team[team].set(i, averageRunsPerGame);
      }
    }
  }

  private allSchedulesHaveSameNAmountOfGames(schedules: TeamSchedule[], numberOfGames: number): boolean {
    const allSchedulesHaveCorrectNumberOfGamesOrMore: boolean = schedules.every(({schedule}: TeamSchedule) => schedule.length >= numberOfGames);
    const allSchedulesGamesHaveSameAmountOfGames: boolean = new Set(schedules.map(({schedule}: TeamSchedule) => schedule.length)).size === 1;

    return allSchedulesGamesHaveSameAmountOfGames && allSchedulesHaveCorrectNumberOfGamesOrMore;
  }

  getTeamValues(team: string): any {
    return this.Team[team].values();
  }

  listRankingTeams(schedules: TeamSchedule[], numberOfGames: number): LeagueRanking[] {
    return schedules
      .sort((a, b) => {
        const aTeamAverageRunsPerGameInLastN: number = this.functionToGetRequiredData(a, numberOfGames);
        const bTeamAverageRunsPerGameInLastN: number = this.functionToGetRequiredData(b, numberOfGames);

        return aTeamAverageRunsPerGameInLastN - bTeamAverageRunsPerGameInLastN;
      })
      .reverse()
      .map((teamSchedule: TeamSchedule, index: number) => {
        return {
          team: teamSchedule.team,
          rank: String(index + 1),
          value: this.functionToGetRequiredData(teamSchedule, numberOfGames),
        } as LeagueRanking
      });
  }
}
