import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {Analysts} from "../../../../common/resolvers/picks.resolver";
import {Game} from "../../../../common/model/game.interface";
import {Teams} from "../../../../common/model/team.interface";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgStyle} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/select";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {NgSelectModule} from "@ng-select/ng-select";
import {MatChip, MatChipListbox, MatChipOption, MatChipSet} from "@angular/material/chips";
import {PicksFormComponent} from "../picks-form/picks-form.component";
import {GameRunDownComponent} from "../game-run-down/game-run-down.component";

@Component({
  selector: 'app-picks-view',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    MatFormField,
    ReactiveFormsModule,
    NgStyle,
    MatButton,
    MatInput,
    MatLabel,
    NgSelectModule,
    DatePipe,
    MatChip,
    MatChipSet,
    MatChipOption,
    MatChipListbox,
    NgClass,
    PicksFormComponent,
    GameRunDownComponent,
  ],
  templateUrl: './picks-view.component.html',
  styleUrl: './picks-view.component.css'
})
export class PicksViewComponent {
  @Input() picks: Analysts = {} as Analysts;
  @Input() games: Game[] = [];
  @Input() teams: Teams = {} as Teams;

  @Output() savePicks: EventEmitter<any> = new EventEmitter();
  @Output() addAnalystToPicks: EventEmitter<any> = new EventEmitter();

  analystList: string[] = ['JDBetsHQ', 'Ron Romanelli', 'Stump The Spread', 'CBS Sports Expert', 'Odds Trader']
  analystName: string = '';
  form: FormGroup = new FormGroup<any>({});

  constructor(private fb: FormBuilder) {}

  emitSavePicks(value: any) {
    console.log('emitSavePicks: ', value);
    this.savePicks.emit(value);
  }

  newAnalysts(analyst: string = ''): FormGroup {
    return this.fb.group({
      firstName: analyst,
      picks: this.fb.array([])
    });
  }

  newPick(game: Game = {} as Game, pick: string = '', analyst: string = ''): FormGroup {
    const {gameID, boxScore}: Game = game;
    let winningTeam = '';
    let winner: string = '';

    if (boxScore) {
      if (boxScore.homeResult === 'W') {
        winningTeam = this.getHomeTeam(game);
      } else if (boxScore.awayResult === 'W') {
        winningTeam = this.getAwayTeam(game);
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

  addCustomAnalyst() {
    this.analystList.push(this.analystName);
    const theNewAnalyst = this.newAnalysts(this.analystName);

    this.games.forEach((game: Game) => {
      const pick = this.newPick(game);
      (theNewAnalyst?.get('picks') as FormArray).push(pick);
    });

    // this.analysts().push(theNewAnalyst);
    this.addAnalystToPicks.emit(theNewAnalyst.value);
    this.analystName = '';
  }

  getHomeTeam({home}: Game) {
    return this.teams.getTeamName(home);
  }

  getAwayTeam({away}: Game) {
    return this.teams.getTeamName(away);
  }

  LogValue() {
    console.log('form: ', this.form.value);
  }
}
