import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {Analyst, Analysts, GamePick} from "../../../../common/resolvers/picks.resolver";
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
export class PicksFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() picks: Analysts = {} as Analysts;
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;

  @Output() savePicks: EventEmitter<any> = new EventEmitter();
  @Output() addAnalystToPicks: EventEmitter<any> = new EventEmitter();

  analystList: string[] = ['JDBetsHQ', 'Ron Romanelli', 'Stump The Spread', 'CBS Sports Expert', 'Odds Trader'];
  form: FormGroup = new FormGroup<any>({
    experts: new FormArray([])
  });

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['picks'] !== undefined && !changes['picks'].isFirstChange()) {
    //   this.form = this.fb.group({
    //     analysts: this.fb.array([])
    //   });
    //
    //   this.loadFormWithAnalystData(this.picks);
    // }
  }

  ngOnInit() {
    this.analystList.forEach((expert: string, index: number) => {
      const newExpertControl: FormGroup = this.createExpertControl(expert);
      this.expertControls.push(newExpertControl);

      // this.games.forEach(game => {
      //   const newPredictionControl: FormGroup = this.createPredictionControl(game);
      //   this.getExpertPredictions(index).push(newPredictionControl);
      // });
    });
  }

  get expertControls(): FormArray {
    return this.form.get('experts') as FormArray;
  }

  getExpertFormGroup(expertIndex: number): FormGroup {
    return (this.form.get('experts') as FormArray).at(expertIndex) as FormGroup;
  }

  getExpertPredictions(expertIndex: number) {
    return this.getExpertFormGroup(expertIndex).get('predictions') as FormArray;
  }

  createExpertControl(expert: string = ''): FormGroup {
    return this.fb.group({
      name: expert,
      predictions: this.fb.array([])
    });
  }

  createPredictionControl({gameID}: Game) {
    return this.fb.group({
      prediction: [''],
      correct: [],
      gameID,
    });
  }

  analystPicks(index: number): FormArray {
    return this.expertControls
      .at(index)
      .get('picks') as FormArray;
  }

/*
  newPick(game: Game = {} as Game, pick: string = '', analyst: string = ''): FormGroup {
    const {gameID, boxScore}: Game = game;
    let winningTeam = '';
    let winner: string = '';

    if (boxScore) {
      if (boxScore.homeResult === 'W') {
        winningTeam = this.teams.getHomeTeam(game);
      } else if (boxScore.awayResult === 'W') {
        winningTeam = this.teams.getAwayTeam(game);
      } else {
        const pickObject: any = {winner, gameID, pick};
        return this.fb.group(pickObject);
      }
    }

    if (winningTeam) {
      if (pick !== '') {
        winner = winningTeam === pick ? 'right': 'wrong';
      }
    }

    const pickObject: any = {winner, gameID, pick};
    return this.fb.group(pickObject);
  }
  loadForm() {
    this.analystList.forEach((analyst: string, index: number) => {
      const newAnalyst: FormGroup = this.createExpertControl(analyst);
      this.expertControls().push(newAnalyst);

      this.games.forEach((game: Game) => {
        const pick = this.newPick(game);
        (this.expertControls().at(index).get('picks') as FormArray).push(pick);
      });
    });
  }

  loadFormWithAnalystData(formValue: Analysts) {
    console.log('loadFormWithAnalystData');
    formValue.analysts.forEach(({firstName}: Analyst, index: number) => {
      const newAnalyst: FormGroup = this.createExpertControl(firstName);
      this.expertControls().push(newAnalyst);

      this.games.forEach((game: Game) => {
        let checkedPick = '';


        const analystObj: Analyst | undefined = formValue.analysts.find((a: Analyst) => a.firstName === firstName);
        if (analystObj) {
          const userPick: GamePick | undefined = analystObj.picks.find((gamePick: GamePick) => gamePick.gameID === game.gameID);
          if (userPick) {
            checkedPick = userPick.pick;
          }
        }

        const pick = this.newPick(game, checkedPick, firstName);
        (this.expertControls().at(index).get('picks') as FormArray).push(pick);
      });
    });
  }
  */

  getPicksStyle() {
    let columnLength: number;

    if (this.picks) {
      columnLength = this.picks.analysts.length;
    } else {
      columnLength = this.analystList.length;
    }

    return {
      display: 'flex',
      'flex-direction': 'row',
    };
  }

  ngOnDestroy(): void {
    if (this.picks) {
      const originalPicks: string = JSON.stringify(this.picks);
      const newPicks: string = JSON.stringify(this.form.value);

      if (originalPicks === newPicks) return;
    }

    this.savePicks.emit(this.form.value);
  }

  getBorderColor(pick: AbstractControl) {
    // console.log('pick: ', pick.value);
    return pick['value']['winner'];
  }
  //
  LogValue() {
    console.log('form: ', this.form.value);
  }

  protected readonly JSON = JSON;
}
