import {Component, Input, OnInit} from '@angular/core';
import {Game, Games} from "../../../common/model/game.interface";
import {TeamSchedule} from "../../../common/model/team-schedule.interface";
import {Teams} from "../../../common/model/team.interface";
import {NewSlate, Slates} from "../../data-access/slate.model";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {Expert, Experts, Slate} from "../../../common/resolvers/picks.resolver";
import {AsyncPipe, DatePipe} from "@angular/common";
import {BehaviorSubject, Observable} from "rxjs";
import {SlateDetailsComponent} from "../slate-details/slate-details.component";
import {SlateFormComponent} from "../slate-form/slate-form.component";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {BackendApiService} from "../../../common/services/backend-api/backend-api.service";
import {MatDivider} from "@angular/material/divider";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'slate-container',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonToggle, MatButtonToggleGroup,
    DatePipe, AsyncPipe,
    SlateDetailsComponent, SlateFormComponent,
    MatChipListbox, MatChipOption, MatButton, MatFormField, MatInput, MatLabel, MatDivider, MatSlideToggle
  ],
  templateUrl: './slate-container.component.html',
  styleUrl: './slate-container.component.css'
})
export class SlateContainerComponent implements OnInit {
  @Input() slates!: Slates;
  @Input() dailySchedule!: Game[];
  @Input('schedules') allSchedules!: TeamSchedule[];
  @Input() boxScoreSchedule!: TeamSchedule[];
  @Input() teams!: Teams;

  private expertsSubject: BehaviorSubject<Experts> = new BehaviorSubject<Experts>([] as Experts);
  private gamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);

  protected experts$: Observable<Experts> = this.expertsSubject.asObservable();
  protected games$: Observable<Game[]> = this.gamesSubject.asObservable();

  expertName: string = '';
  selectedDate: string = '';
  dates: string[] = [];
  showTeamCity: boolean = false;

  constructor(private datePipe: DatePipe,
              private backendApiService: BackendApiService) {
  }

  ngOnInit(): void {
    this.dates = this.slates.map(({date}: NewSlate) => date);

    const today: string = this.today!;
    if (!this.dates.includes(today)) {
      this.dates.push(today);
    }

    const yyyyMMdd: string = this.dates.slice().pop()!;
    this.selectedDate = yyyyMMdd;

    this.chooseDate(yyyyMMdd);
  }

  addExpertToSlate() {
    if (this.expertName === '') return;

    const newExpert: Expert = {
      name: this.expertName,
      predictions: []
    } as Expert;

    this.slates[this.currentSlateIndex].experts.push(newExpert);
    this.chooseDate(this.selectedDate);
  }

  chooseDate(yyyyMMdd: string) {
    this.selectedDate = yyyyMMdd;
    if (this.selectedDate === this.today) {
      this.gamesSubject.next(this.gamesToday);
    } else {
      const gamesForDate: Game[] = Games.getGamesWithBoxScoresForDate(this.boxScoreSchedule, this.selectedDate);
      this.gamesSubject.next(gamesForDate);
    }

    const slate: NewSlate | undefined = this.getSlateFor(this.selectedDate);

    if (slate) {
      this.expertsSubject.next(slate.experts);
    } else {
      this.expertsSubject.next([] as Experts);
    }
  }

  getDate(yyyyMMdd: string): Date {
    const formattedDate = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');

    return new Date(formattedDate);
  }

  private get gamesToday(): Game[] {
    return new Games(this.dailySchedule.slice()).sortedGames;
  }

  get today() {
    return this.datePipe.transform(new Date(), 'yyyyMMdd');
  }

  updateSlate({experts}: { experts: Experts }) {
    const slateIndex: number = this.currentSlateIndex;
    if (slateIndex !== -1) {
      this.slates[slateIndex].experts = experts;
    } else {
      this.slates.push(new NewSlate(this.selectedDate, experts));
    }

    this.backendApiService.updateSlates(this.slates).subscribe(res => {
      console.log('response: ', res);
    });
  }

  private get currentSlateIndex() {
    return this.slates.findIndex(({date}: NewSlate) => date === this.selectedDate);
  }

  private getSlateFor(yyyyMMdd: string): NewSlate | undefined {
    return this.slates.find(({date}: NewSlate) => date === yyyyMMdd);
  }
}
