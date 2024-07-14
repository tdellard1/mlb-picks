import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import {Game, Games} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {Slate, Slates} from "../../data-access/slate.model";
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
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
import {Expert, Experts} from "../../data-access/expert.interface";
import {ExpertRecords} from "../../data-access/expert-records.model";
import {LoggerService} from "../../../common/services/logger.service";
import {StateService} from "../../../common/services/state.service";
import {ActivatedRoute, Data} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {map} from "rxjs/operators";
import {NgSelectModule} from "@ng-select/ng-select";

@Component({
  selector: 'slate-container',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonToggle, MatButtonToggleGroup,
    DatePipe, AsyncPipe,
    SlateDetailsComponent, SlateFormComponent,
    MatChipListbox, MatChipOption, MatButton, MatFormField, MatInput, MatLabel, MatDivider, MatSlideToggle, NgIf, NgSelectModule
  ],
  templateUrl: './slate-container.component.html',
  styleUrl: './slate-container.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlateContainerComponent extends SubscriptionHolder implements OnInit, AfterViewChecked {
  @ViewChild('dateSelector') private dateSelectorContainer: ElementRef;

  teams: Teams;
  slates: Slates;
  dailySchedule: Game[];

  private expertsSubject: BehaviorSubject<Experts> = new BehaviorSubject<Experts>([] as Experts);
  private gamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);

  protected experts$: Observable<Experts> = this.expertsSubject.asObservable();
  protected games$: Observable<Game[]> = this.gamesSubject.asObservable();

  expertRecords: ExpertRecords = {} as ExpertRecords;
  expertName: string = '';
  selectedDate: string = '';
  showTeamCity: boolean = false;
  dates: string[] = [];
  mobileSelectedExpert: string;
  handsetPortrait$: Observable<boolean>;

  constructor(private datePipe: DatePipe,
              private route: ActivatedRoute,
              private logger: LoggerService,
              private stateService: StateService,
              private breakpoint: BreakpointObserver,
              private backendApiService: BackendApiService) {
    super();
  }

  ngOnInit(): void {
    this.handsetPortrait$ = this.breakpoint.observe(Breakpoints.HandsetPortrait)
      .pipe(map((bpState: BreakpointState) => bpState.matches))


    this.subscriptions.push(this.route.data.subscribe((data: Data) => {
      this.teams = data['teams'];
      this.slates = data['slates'];
      this.dailySchedule = data['dailySchedule'];
    }));

    this.selectedDate = this.setDatesAndGetMostRecent();
    this.chooseDate(this.selectedDate);
    this.expertRecords = new ExpertRecords(this.slates, this.teams);
  }

  setDatesAndGetMostRecent(): string {
    this.dates = this.slates.map(({date}: Slate) => date);

    const today: string = this.today;
    if (!this.dates.includes(today)) {
      this.dates.push(today);
    }

    return this.dates[this.dates.length - 1];
  }

  protected addExpertToSlate() {
    if (this.expertName === '') return;

    const newExpert: Expert = {
      name: this.expertName,
      predictions: []
    } as Expert;

    this.slates[this.currentSlateIndex].experts.push(newExpert);
    this.chooseDate(this.selectedDate);
  }

  protected chooseDate(yyyyMMdd: string) {
    this.logger.info(`Chosen Date: ${yyyyMMdd}`);
    this.selectedDate = yyyyMMdd;
    if (this.selectedDate === this.tomorrow) {
      // Replace this and Tomorrow with requesting a new daily schedule from tank01
    } else if (this.selectedDate === this.today) {
      this.gamesSubject.next(this.gamesToday);
    } else {
      const gamesForDate: Game[] = Games.getGamesWithBoxScoresForDate(
        this.stateService.getScheduleAsArray, this.selectedDate);
      this.gamesSubject.next(gamesForDate);
    }

    const slate: Slate | undefined = this.getSlateFor(this.selectedDate);

    if (slate) {
      this.expertsSubject.next(slate.experts);
    } else {
      this.expertsSubject.next([] as Experts);
    }
  }

  protected getDate(yyyyMMdd: string): Date {
    const formattedDate = yyyyMMdd.replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');

    return new Date(formattedDate);
  }

  private get gamesToday(): Game[] {
    return new Games(this.dailySchedule.slice()).sortedGames;
  }

  private get today(): string {
    return this.datePipe.transform(new Date(), 'yyyyMMdd')!;
  }

  private get tomorrow() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));

    return this.datePipe.transform(tomorrow, 'yyyyMMdd');
  }

  /* --------------------------------------------- */
  /* ------------- SLATE METHODS ----------------- */

  /* --------------------------------------------- */
  private get currentSlateIndex() {
    return this.slates.findIndex(({date}: Slate) => date === this.selectedDate);
  }

  private getSlateFor(yyyyMMdd: string): Slate | undefined {
    return this.slates.find(({date}: Slate) => date === yyyyMMdd);
  }

  protected updateSlate({experts}: { experts: Experts }) {
    const slateIndex: number = this.currentSlateIndex;
    if (slateIndex !== -1) {
      this.slates[slateIndex].experts = experts;
    } else {
      this.slates.push(new Slate(this.selectedDate, experts));
    }

    this.backendApiService.updateSlates(this.slates).subscribe(res => {
      console.log('response: ', res);
    });
  }

  updateSlateFromSelection({experts}: { experts: Experts }) {
    const slateIndex: number = this.currentSlateIndex;
    if (slateIndex !== -1) {
      this.slates[slateIndex].experts = experts;
    } else {
      this.slates.push(new Slate(this.selectedDate, experts));
    }

    this.chooseDate(this.selectedDate);
  }

  scrollToDate() {
    this.dateSelectorContainer.nativeElement.scrollLeft = this.dateSelectorContainer.nativeElement.scrollWidth;
  }

  ngAfterViewChecked(): void {
    this.scrollToDate()
  }
}
