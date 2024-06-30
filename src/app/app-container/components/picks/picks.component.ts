import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Game} from "../../../common/model/game.interface";
import {Teams} from "../../../common/model/team.interface";
import {Analyst, Analysts, Expert, Experts, ExpertGamePick, Picks, Slate} from "../../../common/resolvers/picks.resolver";
import {PicksViewComponent} from "./picks-view/picks-view.component";
import {MatChipListbox, MatChipOption} from "@angular/material/chips";
import {BehaviorSubject, Observable} from "rxjs";
import {AsyncPipe, DatePipe} from "@angular/common";
import {TeamSchedule} from "../../../common/model/team-schedule.interface";
import {ensure} from "../../../common/utils/array.utils";
import {getDateString, getStartTimeAsNumber} from "../../../common/utils/date.utils";
import {FormsModule} from "@angular/forms";
import {BackendApiService} from "../../../common/services/backend-api/backend-api.service";

@Component({
  selector: 'app-picks',
  standalone: true,
  imports: [
    PicksViewComponent,
    MatChipOption,
    MatChipListbox,
    AsyncPipe,
    FormsModule,
  ],
  templateUrl: 'picks.component.html',
  styleUrl: './picks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PicksComponent implements OnInit {
  @Input() slate!: Slate;
  @Input() dailySchedule: Game[] = [];
  @Input() schedules: TeamSchedule[] = [];
  @Input() teamSchedulesWithBoxScores: TeamSchedule[] = [];
  @Input() teams: Teams = {} as Teams;

  private expertsSubject: BehaviorSubject<Experts> = new BehaviorSubject<Experts>([] as Experts);
  private gamesSubject: BehaviorSubject<Game[]> = new BehaviorSubject<Game[]>([]);

  protected experts$: Observable<Experts> = this.expertsSubject.asObservable();
  protected games$: Observable<Game[]> = this.gamesSubject.asObservable();

  dateSelected: string = '';
  datesAvailable: string[] = [];

  constructor(private datePipe: DatePipe,
              private backEndApiService: BackendApiService) {
  }

  ngOnInit(): void {
    this.datesAvailable = [...this.slate.dates.keys()];
    const anyAvailableDateInPicks: boolean = !!this.datesAvailable.length;
    const today: string = this.getCurrentDay();
    let lastDateAvailableInPick;

    if (anyAvailableDateInPicks) lastDateAvailableInPick = [...this.datesAvailable].reverse()[0];
    if (lastDateAvailableInPick !== today) this.datesAvailable.push(today);

    if (anyAvailableDateInPicks) {
      const availablePickDateIsToday: boolean = lastDateAvailableInPick === today;
      this.setUpPickForToday(availablePickDateIsToday);
    } else {
      this.setUpPickForToday();
    }

    const oddsTrader: ExpertGamePick[] = [...this.slate.dates]
      .map(value => value[1])
      .map((experts: Experts) => experts
        .filter((expert: Expert) => expert.name === 'Odds Trader')
      ).flat().map((expert: Expert) => expert.predictions).flat();

    const oddsTraderCorrect: number = oddsTrader.filter(({correct}: ExpertGamePick) => correct === true).map(({correct}: ExpertGamePick) => correct).length;
    const oddsTraderWrong: number = oddsTrader.filter(({correct}: ExpertGamePick) => correct === false).map(({correct}: ExpertGamePick) => correct).length;

    console.log('odds Trader record: ', oddsTraderCorrect, ' - ', oddsTraderWrong );

    const cbsSports: ExpertGamePick[] = [...this.slate.dates]
      .map(value => value[1])
      .map((experts: Experts) => experts
        .filter((expert: Expert) => expert.name === 'CBS Sports Expert')
      ).flat().map((expert: Expert) => expert.predictions).flat();

    const cbsSportsCorrect: number = cbsSports.filter(({correct}: ExpertGamePick) => correct === true).map(({correct}: ExpertGamePick) => correct).length;
    const cbsSportsWrong: number = cbsSports.filter(({correct}: ExpertGamePick) => correct === false).map(({correct}: ExpertGamePick) => correct).length;

    console.log('CBS Sports Experts record: ', cbsSportsCorrect, ' - ', cbsSportsWrong );
  }

  setUpPickForToday(havePicksForToday: boolean = false) {
    if (havePicksForToday) {
      this.expertsSubject.next(this.slate.dates.get(this.getCurrentDay())!);
    } else {
      this.expertsSubject.next([] as Experts);
    }

    this.gamesSubject.next(this.sortGames(this.dailySchedule));
  }

  changeDate(selectedDate: any) {
    this.dateSelected = selectedDate;
    const isDateToday: boolean = selectedDate === this.getCurrentDay();
    const picksForSelectedDay: Experts = this.slate.dates.get(selectedDate)!;
    const needToGetScheduleFromPicks: boolean = !!picksForSelectedDay && !!picksForSelectedDay[0];

    // If there are picks, sort games based on pick order(should be consistent for all analyst)
    if (needToGetScheduleFromPicks) {
      const {predictions} = picksForSelectedDay[0];

      // Sort games based on picks order
      const games: Game[] = predictions.map((gp: ExpertGamePick) => {
        if (isDateToday) {
          return ensure(this.dailySchedule.find((game: Game) => game.gameID === gp.gameID));
        } else {
          const game: Game | undefined = this.gamesForSpecificDate(selectedDate).find((game: Game) => game.gameID === gp.gameID);
          const replacementGame: Game | undefined = this.schedules.map(({schedule}: TeamSchedule) => schedule).flat().find((game: Game) => game.gameID === gp.gameID);
          if (replacementGame === undefined) {
            console.log('game is nowhere: ', gp.gameID);
          }
          return game === undefined ? replacementGame : game;
        }
      });

      this.expertsSubject.next(this.slate.dates.get(selectedDate)!);
      this.gamesSubject.next(games);
    } else {
      this.expertsSubject.next(undefined as unknown as Experts);
      this.gamesSubject.next(this.sortedGames);
    }
  }

  getCurrentDay(): string {
    const today: string | null = this.datePipe.transform(new Date(), 'yyyyMMdd');
    if (today) return today;
    throw new Error('Today should be a day');
  }

  private gamesForSpecificDate(selectedDate: string): Game[] {
    const games: Game[] = this.teamSchedulesWithBoxScores.map(({schedule}: TeamSchedule) => schedule).flat();
    return games.filter(({gameID}: Game, index: number, array: Game[]) => index === array.findIndex((o) => o.gameID === gameID)).filter((game: Game) => game.gameDate === selectedDate);
  }

  private get sortedGames(): Game[] {
    return this.sortGames(this.dailySchedule);
  }

  private sortGames(games: Game[]): Game[] {
    return games
      .sort((a, b) => {
        const chronologicalOrder: number = getStartTimeAsNumber(a) - getStartTimeAsNumber(b);
        const alphabeticalOrder: number = a.away < b.away ? 1 : -1;

        return chronologicalOrder || alphabeticalOrder;
      });
  }

  protected savePicks({experts}: any) {
    const updatedPicks: Slate = Object.assign({}, this.slate);
    updatedPicks.dates.set(this.dateSelected, experts);

    console.log('updatedPicks: ', updatedPicks);

    this.backEndApiService.updateSlates(updatedPicks).subscribe((value: any) => {
      console.log(value['message']);
    });
  }

  protected readonly getDateString = getDateString;

  // addAnalystToPicks(analyst: Analyst) {
  //   this.slate[this.dateSelected].push(analyst);
  //   this.expertsSubject.next(Object.assign({}, this.slate[this.dateSelected]));
  // }
}
