import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {SlatePredictionsComponent} from "../slate-predictions/slate-predictions.component";
import {Expert, Experts} from "../../data-access/expert.interface";

@Component({
  selector: 'slate-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    ReactiveFormsModule,
    SlatePredictionsComponent
  ],
  templateUrl: './slate-form.component.html',
  styleUrl: './slate-form.component.css'
})
export class SlateFormComponent implements OnChanges, OnDestroy {
  @Input() teams!: Teams;
  @Input() expertsData!: Experts;
  @Input() games!: Game[];
  @Input() expertsList!: string[];

  @Output() saveExpertPredictions: EventEmitter<{experts: Experts}> = new EventEmitter();
  @Output() updateSlate: EventEmitter<{experts: Experts}> = new EventEmitter();

  defaultExperts: string[] = ['JDBetsHQ', 'Ron Romanelli', 'MLB Gambling Podcast', 'CBS Sports Expert', 'Odds Trader'];
  form: FormGroup = new FormGroup({
    experts: new FormArray([])
  });


  constructor(private fb: FormBuilder) {}

  ngOnChanges(): void {
    // const expertList: string[] = this.expertsList?.length ? this.expertsList : this.defaultExperts;
    // this.addControlForEachExpert(expertList);

    const expertList: string[] = this.expertsData?.length ? this.expertsData.map(value => value.name) : this.defaultExperts;
    this.addControlForEachExpert(expertList);
  }

  addControlForEachExpert(expertList: string[]): void {
    this.experts.clear();

    expertList.forEach((expert: string) => {
      const newExpertControl: FormGroup = this.createExpert(expert);
      this.experts.push(newExpertControl);
    });
    }

  get experts(): FormArray {
    return this.form.get('experts') as FormArray;
  }


  getExpertFormGroup(expertIndex: number): FormGroup {
    return (this.form.get('experts') as FormArray).at(expertIndex) as FormGroup;
  }

  getExpertData(expertIndex: number): Expert {
    return this.expertsData?.at(expertIndex)!;
  }

  private createExpert(expert: string = ''): FormGroup {
    return this.fb.group({
      name: expert,
      predictions: this.fb.array([])
    });
  }

  ngOnDestroy(): void {
    this.saveExpertPredictions.emit(this.form.value);
  }

  updateSlateAfterSelection() {
    this.updateSlate.emit(this.form.value);
  }
}
