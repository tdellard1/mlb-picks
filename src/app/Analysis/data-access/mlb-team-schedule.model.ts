import {TeamSchedule} from "../../common/model/team-schedule.interface";
import {Game} from "../../common/model/game.interface";
import {deepCopy} from "../../common/utils/general.utils";
import {MLBGame} from "./mlb-game.model";
import {RunsFirstInning} from "./runs-first-inning.model";

export class MLBTeamSchedule {
  private readonly _teamAbv: string;
  private readonly _games: MLBGame[];
  runsFirstInning!: RunsFirstInning;

  constructor({team, schedule}: TeamSchedule) {
    this._teamAbv = team;
    this._games = schedule.map((game: Game) => new MLBGame(this._teamAbv, game));
    this.runsFirstInning = new RunsFirstInning();

    this._games.forEach((game: MLBGame) => {
      this.processRunsFirstInning(game, this._teamAbv);
    });
  }

  processRunsFirstInning(game: Game, team: string) {
    let lineScore = game.lineScore || game.boxScore?.lineScore;
    if (lineScore) {
      const isHome: boolean = lineScore.home.team === team;

      if (isHome) {
        const isNRFI: boolean = Number(lineScore.home.scoresByInning[1]) === 0;

        if (isNRFI) {
          this.runsFirstInning.addHomeNRFI();
        } else {
          this.runsFirstInning.addHomeYRFI();
        }
      } else {
        const isNRFI: boolean = Number(lineScore.away.scoresByInning[1]) === 0;

        if (isNRFI) {
          this.runsFirstInning.addAwayNRFI();
        } else {
          this.runsFirstInning.addAwayYRFI();
        }
      }
    } else {
      return;
    }
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
      games = games.sort((a, b) => Number(b.gameTime_epoch) - Number(a.gameTime_epoch)).slice(0, limit).reverse();
    }

    return games;
  }

  get team() { return this._teamAbv; }

  private get copyOfSchedule(): MLBGame[] { return deepCopy<MLBGame[]>(this._games); }

  get analysisSchedule() {
    return this.getSchedule(true, true, 15);
  }
}
