import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatButton} from "@angular/material/button";
import {Game} from "../../../../common/model/game.interface";
import {Team, Teams} from "../../../../common/model/team.interface";

@Component({
  selector: 'expert-predictions',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    MatButton,
    NgStyle
  ],
  templateUrl: './expert-predictions.component.html',
  styleUrl: './expert-predictions.component.css'
})
export class ExpertPredictionsComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  @Input() parentForm!: FormGroup;
  @Input() expertControl!: AbstractControl;
  @Input() index!: number;
  @Input() games!: Game[];
  @Input() teams!: Teams;

  get predictions() {
    return this.parentForm.get('predictions') as FormArray;
  }

  getPrediction(predictionIndex: number) {
    return this.predictions.at(predictionIndex) as FormGroup;
  }

  private createPredictionControl(gameID: string): FormGroup {
    return this.fb.group({
      gameID: [gameID],
      prediction: this.fb.group({}),
      options: this.fb.array([])
    });
  }

  getOptions(index: number) {
    return this.getPrediction(index).get('options') as FormArray;
  }

  private createOptions(option: string): FormGroup {
    return this.fb.group({
      option: [option]
    })
  }

  LogValue() {
    console.log('this.getOptions(0).value: ', this.getOptions(0).controls);
  }

  ngOnInit(): void {
    this.games.forEach(({gameID, home, away}: Game, index: number) => {
      const newPredictionControl: FormGroup = this.createPredictionControl(gameID);
      this.predictions.push(newPredictionControl);

      const options: FormGroup[] = [
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

  getStyles() {
      return {
        display: 'grid',
        'grid-template-columns': `1fr)`,
        'grid-template-rows': `repeat(${this.games.length + 1}, 1fr)`,
        'grid-auto-flow': `column`,
        'grid-gap': '10px',
        padding: '5px'
      };
    }
}
