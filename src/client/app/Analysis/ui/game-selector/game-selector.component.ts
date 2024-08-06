import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {Game} from "../../../common/model/game.interface";
import {Team} from "../../../common/model/team.interface";
import {MatDivider} from "@angular/material/divider";
import {map, tap} from "rxjs/operators";
import {ActivatedRoute, Data, Router, RouterLink} from "@angular/router";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";

@Component({
  selector: 'game-selector',
  standalone: true,
  imports: [
    MatCard,
    NgOptimizedImage,
    MatDivider,
    AsyncPipe,
    NgIf,
    RouterLink
  ],
  templateUrl: './game-selector.component.html',
  styleUrl: './game-selector.component.css',
})
export class GameSelectorComponent extends SubscriptionHolder implements OnDestroy, OnInit {
  dailySchedule: Game[] = [];
  selectedGame!: Game;
  teams: Map<string, Team> = new Map();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private activatedRoute: ActivatedRoute) {
    super();
  }
  ngOnInit(): void {
    const teams: Team[] = this.route.snapshot.data['teams'] as Team[];
    teams.forEach((team: Team) => this.teams.set(team.teamAbv, team));

    this.subscriptions.push(
      this.activatedRoute.data.pipe(
        map((data: Data) => data['dailySchedule'] as Game[]),
        map((games: Game[]) => games.sort(this.dailyScheduleSorter))
      ).subscribe((games: Game[]) => {
        if (this.dailySchedule.length < 1) {
          this.dailySchedule = games;
        }

        const childRoute: ActivatedRoute | undefined = this.activatedRoute.children[0];
        if (childRoute) {
          const selectedGameID: string = this.activatedRoute.children[0].snapshot.params['gameId'];
          const selectedGame: Game | undefined = this.dailySchedule.find(({gameID}) => gameID === selectedGameID);
          if (selectedGame) {
            this.selectedGame = selectedGame;
          } else {
            this.selectedGame = this.dailySchedule[0];
          }
        } else {
          this.selectedGame = this.dailySchedule[0];
        }

        this.onGameSelected(this.selectedGame);
      }),
    );

  }


  onGameSelected(game: Game): void {
    this.selectedGame = game;
    this.router.navigate([`analysis/${game.gameID}`], {onSameUrlNavigation: "ignore"});
  }

  private dailyScheduleSorter = (a: Game, b: Game) => {
    const aGame: number = Number(a.gameTime_epoch);
    const bGame: number = Number(b.gameTime_epoch);

    return aGame - bGame;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
