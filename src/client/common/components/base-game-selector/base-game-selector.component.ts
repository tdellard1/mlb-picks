import {ChangeDetectorRef, Component} from '@angular/core';
import {GameSelectorService} from "../../../Analysis/data-access/services/game-selector.service";
import {BehaviorSubject, filter, Observable} from "rxjs";
import {Game} from "../../model/game.interface";
import {SubscriptionHolder} from "../subscription-holder.component";

@Component({
  selector: 'base-game-selector',
  standalone: true,
  imports: [],
  templateUrl: './base-game-selector.component.html',
  styleUrl: './base-game-selector.component.css'
})
export abstract class BaseGameSelectorComponent extends SubscriptionHolder {
  private _selectedGame: Game = {} as Game;
  private _selectedGameSubject: BehaviorSubject<Game> = new BehaviorSubject<Game>(this._selectedGame);

  protected constructor(private gameSelectorService: GameSelectorService,
                        private changeDetectorRef: ChangeDetectorRef) {
    super();
    this.subscriptions.push(
      this.gameSelectorService.selectedGameInfo.pipe(
        filter(({game}) => !!game)
      ).subscribe(({game}) => {
        this._selectedGame = game;
        this._selectedGameSubject.next(game);
        this.changeDetectorRef.markForCheck();
      })
    )
  }

  get game(): Game {
    return this._selectedGame;
  }

  get game$(): Observable<Game> {
    return this._selectedGameSubject.asObservable();
  }
}
