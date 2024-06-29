import {Component, OnInit} from "@angular/core";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ExpertPicksComponent} from "./form-general/expert-picks.component";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    ExpertPicksComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
  listOfExperts: string[] = ['CBS Sports', 'Odds Trader', 'Odds Shark'];
  listOfGameIds: string[] = ['Game #1 - 24524', 'Game #2 - 24645', 'Game #3 - 65981'];

  public form = new FormGroup({
    value: new FormControl(""),
    experts: new FormArray([]),
  });

  ngOnInit(): void {
    this.listOfExperts.forEach(expert => {
      this.experts.push(this.createNamedExpert(expert));
    });

    this.experts.controls.forEach((_, index) => {
      this.listOfGameIds.forEach(gameId => {
        this.getPredictions(index).push(this.createPrediction(gameId));
      });
    });
  }

  get controls() {
    return this.form.controls;
  }

  get experts(): FormArray {
    return this.form.get('experts') as FormArray;
  }

  public addNewExpert(expert: FormGroup) {}



  getPredictions(expertIndex: number) {
    return this.experts.at(expertIndex).get('predictions') as FormArray
  }

  private createExpert() {
    return new FormGroup({
      name: new FormControl(),
      predictions: new FormArray([]),
    })
  }

  private createNamedExpert(exportName: string) {
    return new FormGroup({
      name: new FormControl(exportName),
      predictions: new FormArray([]),
    })
  }

  private createPrediction(gameID: string) {
    return new FormGroup({
      gameID: new FormControl(gameID),
      prediction: new FormControl(''),
      correct: new FormControl(undefined),
    })
  }



  public onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.getRawValue();
    }
  }

  protected readonly JSON = JSON;
}
