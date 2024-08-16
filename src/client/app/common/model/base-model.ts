import {ensure} from "../utils/array.utils";
import {LeagueRanking} from "../interfaces/analysis.interface";
import {Schedule} from "../interfaces/team-schedule.interface";

export class BaseModel {
  Team: {[teams: string]: Map<number, number>} = {};
  League: {[games: string]: LeagueRanking[]} = {};
  numberOfGames: number = 15;
  schedules: Schedule[];
  allTeams: string[];

  functionToGetRequiredData: Function = () => {};

  constructor(schedules: Schedule[], numberOfGames?: number) {
    if (numberOfGames) this.numberOfGames = numberOfGames;
    if (!schedules) throw new Error('All Schedules must be defined');

    if (!this.allSchedulesHaveSameNAmountOfGames(schedules, this.numberOfGames))
      throw new Error('All schedules don\'t meet criteria to get stats');

    this.schedules = schedules;
    this.allTeams = schedules.map(({team}: Schedule) => team);

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
        const teamSchedule: Schedule = ensure(this.schedules.find((teamSchedule: Schedule) => teamSchedule.team === team));
        const averageRunsPerGame: number = this.functionToGetRequiredData(teamSchedule, i);
        this.Team[team].set(i, averageRunsPerGame);
      }
    }
  }

  private allSchedulesHaveSameNAmountOfGames(schedules: Schedule[], numberOfGames: number): boolean {
    const allSchedulesHaveCorrectNumberOfGamesOrMore: boolean = schedules.every(({schedule}: Schedule) => schedule.length >= numberOfGames);
    const allSchedulesGamesHaveSameAmountOfGames: boolean = new Set(schedules.map(({schedule}: Schedule) => schedule.length)).size === 1;

    return allSchedulesGamesHaveSameAmountOfGames && allSchedulesHaveCorrectNumberOfGamesOrMore;
  }

  getTeamValues(team: string): any {
    return this.Team[team].values();
  }

  listRankingTeams(schedules: Schedule[], numberOfGames: number): LeagueRanking[] {
    return schedules
      .sort((a, b) => {
        const aTeamAverageRunsPerGameInLastN: number = this.functionToGetRequiredData(a, numberOfGames);
        const bTeamAverageRunsPerGameInLastN: number = this.functionToGetRequiredData(b, numberOfGames);

        return aTeamAverageRunsPerGameInLastN - bTeamAverageRunsPerGameInLastN;
      })
      .reverse()
      .map((teamSchedule: Schedule, index: number) => {
        return {
          team: teamSchedule.team,
          rank: String(index + 1),
          value: this.functionToGetRequiredData(teamSchedule, numberOfGames),
        } as LeagueRanking
      });
  }
}
