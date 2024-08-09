import {BoxScore} from "./box-score.interface";
import {TeamSchedule} from "./team-schedule.interface";
import {Expert, GamePick} from "../../features/Slate/data-access/expert.interface";

export interface Game {
  gameID: string;
  gameType: string;
  away: string;
  gameTime: string;
  teamIDHome: string;
  gameDate: string;
  gameStatus?: string;
  gameTime_epoch: string;
  teamIDAway: string;
  probableStartingPitchers: any;
  probableStartingLineups?: any;
  home: string;
  lineScore?: LineScore;
  boxScore?: BoxScore;
}

export interface LineScore {
  away: LineScoreTeam;
  home: LineScoreTeam;
}

export interface LineScoreTeam {
  E: string;
  H: string;
  R: string;
  scoresByInning: scoreByInning;
  team: string;
}

export interface scoreByInning {
  [inning: number]: string;
}

export class Games {
  games: Game[];


  constructor(games: Game[]) {
    this.games = games;
  }

  get sortedGames(): Game[] {
    return this.games.slice().sort((a: Game, b: Game) => {
      const chronologicalOrder: number = Number(a.gameTime_epoch) - Number(b.gameTime_epoch);
      const alphabeticalOrder: number = a.away > b.away ? 1 : -1;

      return chronologicalOrder || alphabeticalOrder;
    });
  }

  static getGamesWithBoxScoresForDate(schedules: TeamSchedule[], yyyyMMdd: string): Game[] {
    const gamesWithBoxScore: Game[] = schedules
      .slice()
      .map(({schedule}: TeamSchedule) => schedule)
      .flat()
      .filter(({boxScore}: Game) => !!boxScore)
      .filter(({gameDate}: Game) => gameDate === yyyyMMdd)
      .filter(({gameID}: Game, index: number, array: Game[]) => index === array
        .findIndex((o) => o.gameID === gameID));

    const games: Games = new Games(gamesWithBoxScore);

    return games.sortedGames;
  }

  static getGamesWithBoxScores(schedules: TeamSchedule[]): Game[] {
    return schedules
      .slice()
      .map(({schedule}: TeamSchedule) => schedule)
      .flat()
      .filter(({boxScore}: Game) => !!boxScore)
      .filter(({gameID}: Game, index: number, array: Game[]) => index === array
        .findIndex((o) => o.gameID === gameID));
  }

  static getGamesFromSchedules(schedules: TeamSchedule[]): Game[] {
    return schedules
      .slice()
      .map(({schedule}: TeamSchedule) => schedule)
      .flat()
      .filter(({gameID}: Game, index: number, array: Game[]) => index === array
        .findIndex((o) => o.gameID === gameID));
  }

  static getSlateGamesFromPreviousExpertPredictions(expert: Expert, boxScoreSchedules: TeamSchedule[], schedules: TeamSchedule[]): Game[] {
    const gameIDs: string[] = expert.predictions.map(({gameID}: GamePick) => gameID);

    const boxScoreGames: Game[] = Games.getGamesWithBoxScores(boxScoreSchedules);
    const scheduleGames: Game[] = Games.getGamesFromSchedules(schedules);

    return gameIDs.map((gameID: string) => {
      let game: Game | undefined = boxScoreGames.find((boxScoreGame: Game) => boxScoreGame.gameID === gameID);
      if (!game) {
        game = scheduleGames.find((scheduleGame: Game) => scheduleGame.gameID === gameID);
      }
      if (!game) game = { gameID } as Game;

      return game;
    });
  }

  private getTimeAsDate({gameTime}: Game) {
    const [hour, minute]: string[] = gameTime.split(':');
    const meridiem: string = minute.slice(-1);

    const h: number = Number(meridiem === 'p' ? Number(hour) + 12 : hour);
    const m: number = Number(minute.slice(0, -1));
    const d: Date = new Date();
    d.setHours(h);
    d.setMinutes(m);

    return d.getTime();
  }
}
