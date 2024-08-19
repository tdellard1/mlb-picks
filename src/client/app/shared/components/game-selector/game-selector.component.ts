import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/interfaces/game.js";
import {Team} from "../../../common/interfaces/team.interface.js";
import {MatDivider} from "@angular/material/divider";
import {map} from "rxjs/operators";
import {ActivatedRoute, ActivatedRouteSnapshot, Data, Router, RouterLink, RouterOutlet} from "@angular/router";
import {SubscriptionHolder} from "../subscription-holder.component.js";
import {GameUtils} from "../../../common/utils/game.utils";

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage,
    MatDivider,
    AsyncPipe,
    NgIf,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.css',
})
export class GameSelectorComponent extends SubscriptionHolder implements OnDestroy, OnInit {
  private readonly path: string;

  teams: Map<string, Team> = new Map();
  selectedGame: Game;
  dailySchedule: Game[];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute) {
    super();

    this.path = this.activatedRoute.snapshot.parent?.routeConfig?.path!;

    this.subscriptions.push(
      this.activatedRoute.data.pipe(
        map(({dailySchedule}: Data) => dailySchedule as Game[]),
        map((games: Game[]) => games.sort(GameUtils.sortGames))
      ).subscribe((games: Game[]) => {
        this.dailySchedule = games;

        console.log(this.dailySchedule);
        const childRoute: ActivatedRouteSnapshot | undefined = this.activatedRoute.snapshot.children[0];

        if (childRoute) {
          const selectedGameID: string = childRoute.params['gameId'];
          const selectedGame: Game | undefined = this.dailySchedule.find(({gameID}) => gameID === selectedGameID);
          if (selectedGame) {
            this.onGameSelected(selectedGame);
          } else {
            this.onGameSelected(this.dailySchedule[0]);
          }
        } else {
          this.onGameSelected(this.dailySchedule[0]);
        }
      })
    );
  }

  ngOnInit(): void {
    const teams: Team[] = this.activatedRoute.snapshot.data['teams'] as Team[];
    teams.forEach((team: Team) => this.teams.set(team.teamAbv, team));
  }

  onGameSelected(game: Game): void {
    this.selectedGame = game;
    this.router.navigate([`${this.path}/${game.gameID}`], {onSameUrlNavigation: "ignore"});
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
