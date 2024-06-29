import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgStyle} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {Analyst, Analysts, GamePick} from "../../../../common/resolvers/picks.resolver";
import {Game} from "../../../../common/model/game.interface";
import {Teams} from "../../../../common/model/team.interface";

@Component({
  selector: 'app-picks-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgSelectModule,
    ReactiveFormsModule,
    NgStyle
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
  form: FormGroup = new FormGroup<any>({});

  constructor(private fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['picks'] !== undefined && !changes['picks'].isFirstChange()) {
      this.form = this.fb.group({
        analysts: this.fb.array([])
      });

      this.loadFormWithAnalystData(this.picks);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      analysts: this.fb.array([])
    });

    if (this.picks) {
      this.loadFormWithAnalystData(this.picks);
    } else {
      this.loadForm();
    }
  }

  analysts(): FormArray {
    return this.form.get('analysts') as FormArray;
  }

  newAnalysts(analyst: string = ''): FormGroup {
    return this.fb.group({
      firstName: analyst,
      picks: this.fb.array([])
    });
  }

  analystPicks(index: number): FormArray {
    return this.analysts()
      .at(index)
      .get('picks') as FormArray;
  }

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
      const newAnalyst: FormGroup = this.newAnalysts(analyst);
      this.analysts().push(newAnalyst);

      this.games.forEach((game: Game) => {
        const pick = this.newPick(game);
        (this.analysts().at(index).get('picks') as FormArray).push(pick);
      });
    });
  }

  loadFormWithAnalystData(formValue: Analysts) {
    console.log('loadFormWithAnalystData');
    formValue.analysts.forEach(({firstName}: Analyst, index: number) => {
      const newAnalyst: FormGroup = this.newAnalysts(firstName);
      this.analysts().push(newAnalyst);

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
        (this.analysts().at(index).get('picks') as FormArray).push(pick);
      });
    });
  }

  getPicksStyle() {
    let columnLength: number;

    if (this.picks) {
      columnLength = this.picks.analysts.length;
    } else {
      columnLength = this.analystList.length;
    }

    return {
      display: 'grid',
      'grid-template-columns': `repeat(${columnLength}, 1fr)`,
      'grid-template-rows': `repeat(${this.games.length + 1}, 1fr)`,
      'grid-auto-flow': `column`,
      'grid-gap': '10px',
      padding: '5px'
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
}
