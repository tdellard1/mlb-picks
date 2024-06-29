import {BoxScore} from "./box-score.interface";

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
  scoreByInning: scoreByInning;
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

  getGamesInChronologicalOrder() {
    return this.games.sort((a, b) => {
      const chronologicalOrder: number = this.getTimeAsDate(a) - this.getTimeAsDate(b);
      const alphabeticalOrder: number = a.away > b.away ? 1 : -1;

      return chronologicalOrder === 0 ? alphabeticalOrder : chronologicalOrder;
    });
  }

  getGame(gameID: string): Game {
    const game: Game | undefined = this.games.find(game => game.gameID === gameID);
    if (game === undefined) throw new Error(`No such game: ${gameID}`);

    return game;
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
