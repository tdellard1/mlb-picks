import {Slates} from "./slate.model";
import {Expert, GamePick} from "./expert.interface";
import {Team} from "../../common/model/team.interface";

export class ExpertRecords {
  experts: ExpertRecord[] = [];

  constructor(slates: Slates, teams: Team[]) {
    for (const slate of slates) {
      for (const expert of slate.experts) {
        const exportRecord: ExpertRecord | undefined = this.getExpertRecord(expert.name);
        if (exportRecord) {
          exportRecord.loadDataFromNewExpert(expert);
        } else {
          this.experts.push(new ExpertRecord(expert, teams));
        }
      }
    }
  }

  getExpertRecord(name: string): ExpertRecord | undefined {
    return this.experts.slice().find((expertRecord: ExpertRecord) => expertRecord.name === name);
  }

}

export class ExpertRecord  {
  name: string;
  correct: number = 0;
  incorrect: number = 0;
  teams: WinLoss[];

  constructor({predictions, name}: Expert, teams: Team[]) {
    this.name = name;
    this.teams = teams.map(({teamName}: Team) => new WinLoss(teamName));

    this.loadData(predictions);
  }

  private loadData(predictions: GamePick[]) {
    const correctArray: boolean[] = predictions.map((gamePick: GamePick) => gamePick.correct);
    const correctCount: number = correctArray.filter((bool: boolean) => bool !== null && bool !== undefined && bool === true).length;
    const incorrectCount: number = correctArray.filter((bool: boolean) => bool !== null && bool !== undefined && bool === false).length;


    this.correct = this.correct + correctCount;
    this.incorrect = this.incorrect + incorrectCount;

    predictions.forEach(({prediction, correct}: GamePick) => {
      if (this.weHaveLegitimateResults(correct)) {
        if (correct) {
          this.getTeamsWinLoss(prediction)?.updateCorrect();
        } else {
          this.getTeamsWinLoss(prediction)?.updateIncorrect();
        }
      }
    });
  }

  loadDataFromNewExpert({predictions}: Expert) {
    this.loadData(predictions);
  }

  getTeamsWinLoss(team: string): WinLoss | undefined {
    return this.teams?.find((wL: WinLoss) => wL.team === team);
  }

  weHaveLegitimateResults(correct: boolean){
    return correct !== undefined && correct !== null;
  }
}

export class WinLoss {
  correct: number;
  incorrect: number;
  winningRatio: number;
  losingRatio: number;
  team: string

  constructor(team: string) {
    this.team = team;
    this.correct = 0;
    this.incorrect = 0;
    this.winningRatio = 0;
    this.losingRatio = 0;
  }

  updateCorrect() {
    this.correct = this.correct + 1;
    this.updateRatio();
  }
  updateIncorrect() {
    this.incorrect = this.incorrect + 1;
    this.updateRatio();
  }

  private updateRatio() {
    const zeroWinsPlusLosses: boolean = this.correct === 0 && this.incorrect > 0;
    const plusWinsZeroLosses: boolean = this.correct > 0 && this.incorrect === 0;

    if (zeroWinsPlusLosses) {
      this.winningRatio = 0;
      this.losingRatio = Math.round((this.incorrect / (this.correct + this.incorrect)) * 100);
    } else if (plusWinsZeroLosses) {
      this.winningRatio = Math.round((this.correct / (this.correct + this.incorrect)) * 100);
      this.losingRatio = 0;
    } else {
      this.winningRatio = Math.round((this.correct / (this.correct + this.incorrect)) * 100);
      this.losingRatio = Math.round((this.incorrect / (this.correct + this.incorrect)) * 100);
    }
  }
}
