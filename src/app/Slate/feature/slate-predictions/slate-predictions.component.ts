import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgSelectModule} from "@ng-select/ng-select";
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {BoxScore} from "../../../common/model/box-score.interface";
import {NgIf, NgStyle} from "@angular/common";
import {Expert, GamePick} from "../../data-access/expert.interface";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'slate-predictions',
  standalone: true,
  imports: [
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgStyle,
    MatIcon,
    NgIf
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
  @Output() newSelectionMade: EventEmitter<any> = new EventEmitter();

  showPredictions: boolean = true;
  @Input() isMobile!: boolean;

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
        const gamePick: GamePick | undefined = this.expert?.predictions?.at(index);
        const boxScoreData: BoxScore = boxScore!;
        const newPredictionControl: FormGroup = this.createPredictionControl(gameID, gamePick, boxScoreData);
        this.predictions.push(newPredictionControl);

        const options: FormGroup[] = [
          this.createOptions(' '),
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

  private createPredictionControl(gameID: string, gamePick?: GamePick, boxScoreData?: BoxScore): FormGroup {
    let winningTeam: string | undefined = undefined;

    if (boxScoreData) {
      winningTeam = this.getWinningTeam(boxScoreData!);
    }

    if (gamePick) {
      const {prediction, correct}: GamePick = gamePick;
      const hasPredictionAndResult: boolean = !!prediction && correct != null;
      const hasPredictionAndWinningTeam: boolean = !!prediction && winningTeam !== undefined;
      const hasPrediction: boolean = !!prediction;

      // Come Back and Account For Total Under/Over
      if (hasPredictionAndResult) {
        return this.fb.group({
          gameID, prediction, correct,
          options: this.fb.array([]),
        });
      } else if (hasPredictionAndWinningTeam) {
        return this.fb.group({
          gameID, prediction,
          options: this.fb.array([]),
          correct: [winningTeam === prediction]
        });
      } else if (hasPrediction) {
        return this.fb.group({
          gameID,
          prediction: [gamePick.prediction],
          options: this.fb.array([])
        });
      } else {
        return this.fb.group({
          gameID,
          prediction: [''],
          options: this.fb.array([]),
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

  private getWinningTeam({awayResult, away, homeResult, home}: BoxScore) {
    if (awayResult == null || homeResult == null) {
      return undefined;
    }

    if (awayResult === 'W') {
      return this.teams.getTeamName(away);
    } else if (homeResult === 'W') {
      return this.teams.getTeamName(home);
    } else {
      return undefined;
    }
  }

  protected getStyles() {
    return {
      display: 'grid',
      // 'grid-template-columns': '200px',
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

  changeTriggered() {
    this.newSelectionMade.emit();
  }
}
