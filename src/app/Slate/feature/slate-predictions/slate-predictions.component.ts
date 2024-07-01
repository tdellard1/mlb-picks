import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {Expert, ExpertGamePick} from "../../../common/resolvers/picks.resolver";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {BoxScore} from "../../../common/model/box-score.interface";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'slate-predictions',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './slate-predictions.component.html',
  styleUrl: './slate-predictions.component.css'
})
export class SlatePredictionsComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() index!: number;

  @Input() expert!: Expert;
  @Input() games!: Game[];
  @Input() teams!: Teams;

  constructor(private fb: FormBuilder) {}

  get name() {
    return (this.form.get('name') as FormGroup).value;
  }

  get predictions() {
    return this.form.get('predictions') as FormArray;
  }

  getPrediction(predictionIndex: number) {
    return this.predictions.at(predictionIndex) as FormGroup;
  }

  getOptions(index: number) {
    return this.getPrediction(index).get('options') as FormArray;
  }

  ngOnInit(): void {
    this.games.forEach(({gameID, home, away, boxScore}: Game, index: number) => {
      const prediction: ExpertGamePick | undefined = this.expert?.predictions?.at(index);
      const boxScoreData: BoxScore = boxScore!;
      const newPredictionControl: FormGroup = this.createPredictionControl(gameID, prediction, boxScoreData);
      this.predictions.push(newPredictionControl);

      const options: FormGroup[] = [
        this.createOptions('-'),
        this.createOptions(this.teams.getTeamName(away)),
        this.createOptions(this.teams.getTeamName(home)),
        this.createOptions('Total: Over'),
        this.createOptions('Total: Under'),
      ];

      options.forEach((option: FormGroup) => {
        this.getOptions(index).push(option);
      });
    });
  }

  private createPredictionControl(gameID: string, gamePick?: ExpertGamePick, boxScoreData?: BoxScore): FormGroup {
    let winningTeam;
    if (boxScoreData) {
      winningTeam = this.getWinningTeam(boxScoreData);
    }

    if (gamePick && gamePick.prediction && gamePick.correct !== undefined && gamePick.correct !== null) {
      return this.fb.group({
        gameID,
        prediction: [gamePick.prediction],
        options: this.fb.array([]),
        correct: [gamePick.correct]
      });
    } else if (gamePick && gamePick.prediction) {
      if (!winningTeam) {
        return this.fb.group({
          gameID,
          prediction: [gamePick.prediction],
          options: this.fb.array([]),
        });
      } else if (winningTeam === gamePick.prediction) {
        return this.fb.group({
          gameID,
          prediction: [gamePick.prediction],
          options: this.fb.array([]),
          correct: [true]
        });
      } else {
        return this.fb.group({
          gameID,
          prediction: [gamePick.prediction],
          options: this.fb.array([]),
          correct: [false]
        });
      }
    } else {
      return this.fb.group({
        gameID,
        prediction: [''],
        options: this.fb.array([])
      });
    }
  }

  private createOptions(option: string): FormGroup {
    return this.fb.group({
      option: [option]
    })
  }

  private getWinningTeam(boxScore: BoxScore) {
    if (boxScore.awayResult === 'W') {
      return this.teams.getTeamName(boxScore.away);
    } else if (boxScore.homeResult === 'W') {
      return this.teams.getTeamName(boxScore.home);
    } else {
      return undefined;
    }
  }

  protected getStyles() {
    return {
      display: 'grid',
      'grid-template-columns': '1fr',
      'grid-template-rows': `repeat(${this.games.length + 1}, 40px)`,
      'grid-auto-flow': `column`,
      'grid-gap': '10px',
      padding: '5px'
    };
  }

  getRightClass({value}: AbstractControl) {
    if (value.correct !== undefined) return !!value.correct;
    return undefined;
  }

  getWrongClass({value}: AbstractControl) {
    if (value.correct !== undefined) return !value.correct;
    return undefined;
  }
}
