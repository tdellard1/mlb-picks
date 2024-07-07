import {TeamSchedule} from "../../common/model/team-schedule.interface";
import {Game} from "../../common/model/game.interface";
import {deepCopy} from "../../common/utils/general.utils";
import {MLBGame} from "./mlb-game.model";

export class MLBTeamSchedule {
  private readonly _teamAbv: string;
  private readonly _games: MLBGame[];

  constructor({team, schedule}: TeamSchedule) {
    this._teamAbv = team;
    this._games = schedule.map((game: Game) => new MLBGame(this._teamAbv, game));
  }

  getSchedule(beforeToday: boolean = false, mustHaveBoxScores: boolean = false, limit?: number): MLBGame[] {
    let games: MLBGame[] = this.copyOfSchedule;

    if (beforeToday) {
      games = games.filter(({gameTime_epoch}: MLBGame) => {
        const epochForGame: number = Number(gameTime_epoch) * 1000;
        const epochForToday: number = new Date().setHours(0, 0, 0, 0);
        return epochForGame < epochForToday;
      })
    }

    if (mustHaveBoxScores) {
      games = games.filter(({boxScore}: MLBGame) => !!boxScore)
    }

    if (limit) {
      games = games.slice(0, limit);
    }

    return games;
  }

  get team() {
    return this._teamAbv;
  }

  private get copyOfSchedule(): MLBGame[] {
    return deepCopy<MLBGame[]>(this._games);
  }

  get analysisSchedule() {
    return this.getSchedule(true, true, 15);
  }
}
