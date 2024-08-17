import { Component } from '@angular/core';
import {BoxScore} from "../../../common/model/box.score.model";
import {ActivatedRoute} from "@angular/router";
import {BatterStreak, StateUtils} from "../../../common/utils/state.utils";
import {RosterPlayer} from "../../../common/interfaces/players";

@Component({
  selector: 'streaks',
  standalone: true,
  imports: [],
  templateUrl: './streaks.component.html',
  styleUrl: './streaks.component.css'
})
export class StreaksComponent {
  private readonly boxScores: BoxScore[] = this.activatedRoute.snapshot.data['boxScores'] as BoxScore[];
  private readonly players: RosterPlayer[] = this.activatedRoute.snapshot.data['players'] as RosterPlayer[];
  protected hittingStreaks: BatterStreak[] = [];


  constructor(private activatedRoute: ActivatedRoute) {

    this.hittingStreaks = StateUtils.batterStreaks(this.boxScores, this.players).filter(({hitStreak}) => hitStreak >= 5);
  }
}
