import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {Expert, Experts} from "../../../../common/resolvers/picks.resolver";
import {Game} from "../../../../common/model/game.interface";
import {Teams} from "../../../../common/model/team.interface";
import {MatButton} from "@angular/material/button";
import {ExpertPredictionsComponent} from "../expert-predictions/expert-predictions.component";

@Component({
  selector: 'app-picks-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    NgStyle,
    MatButton,
    ExpertPredictionsComponent
  ],
  templateUrl: './picks-form.component.html',
  styleUrl: './picks-form.component.css'
})
export class PicksFormComponent implements OnDestroy, OnChanges {
  @Input() expertsData: Experts = [];
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;

  @Output() savePicks: EventEmitter<any> = new EventEmitter();
  @Output() addAnalystToPicks: EventEmitter<any> = new EventEmitter();

  analystList: string[] = ['JDBetsHQ', 'Ron Romanelli', 'Stump The Spread', 'CBS Sports Expert', 'Odds Trader'];
  form: FormGroup = new FormGroup<any>({
    experts: new FormArray([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    const expertList: string[] = this.expertsData.length ? this.expertsData.map(value => value.name) : this.analystList;
    this.addExpertControls(expertList);
  }

  private addExpertControls(expertList: string[]) {
    this.experts.clear();

    expertList.forEach((expert: string) => {
      const newExpertControl: FormGroup = this.createExpert(expert);
      this.experts.push(newExpertControl);
    });
  }

  getExpertData(expertIndex: number): Expert {
    return this.expertsData.at(expertIndex)!;
  }

  get experts(): FormArray {
    return this.form.get('experts') as FormArray;
  }

  getExpertFormGroup(expertIndex: number): FormGroup {
    return (this.form.get('experts') as FormArray).at(expertIndex) as FormGroup;
  }

  private createExpert(expert: string = ''): FormGroup {
    return this.fb.group({
      name: expert,
      predictions: this.fb.array([])
    });
  }

  ngOnDestroy(): void {
    // if (this.expertsData.length) {
    //
    //   console.log('expertsData: ', this.expertsData);
    //   console.log('this.form.value: ', this.experts.value);
    //
    //   const originalPicks: string = JSON.stringify(this.expertsData);
    //   const newPicks: string = JSON.stringify(this.experts.value);
    //
    //   console.log(originalPicks === newPicks);
    //   if (originalPicks === newPicks) return;
    // }

    this.savePicks.emit(this.form.value);
  }
}
