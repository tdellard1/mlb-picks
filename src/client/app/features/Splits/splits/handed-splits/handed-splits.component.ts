import {Component, Input, OnInit} from '@angular/core';
import {Game} from "../../../../common/interfaces/game";
import {BoxScore} from "../../../../common/model/box.score.model";
import {ActivatedRoute} from "@angular/router";
import {NgIf} from "@angular/common";
import {PlayerStats} from "../../../../common/interfaces/player-stats";
import {Site} from "../../../../common/constants/site";

@Component({
  selector: 'handed-splits',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './handed-splits.component.html',
  styleUrl: './handed-splits.component.css'
})
export class HandedSplitsComponent implements OnInit {
  private readonly boxScoresMap: Map<string, BoxScore> = new Map((this.activatedRoute.snapshot.data['boxScores'] as BoxScore[]).map((boxScore: BoxScore) => [boxScore.gameID, boxScore]));
  private readonly boxScores: BoxScore[] = this.activatedRoute.snapshot.data['boxScores'] as BoxScore[];
  private readonly dailySchedule: Map<string, Game> = new Map((this.activatedRoute.snapshot.data['dailySchedule'] as Game[]).map((game: Game) => [game.gameID, game]));

  @Input() game!: Game;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const boxScores: BoxScore[] = this.boxScores.filter(({teamStats}) => {
      return teamStats.home.Hitting.SF !== '0' ||
        teamStats.home.Hitting.SAC !== '0' ||
        teamStats.away.Hitting.SF !== '0' ||
        teamStats.away.Hitting.SAC !== '0';
    });

    const index: number = 3;

    console.log('Original boxScores: ', boxScores[index]);
    let site: Site;

    if (boxScores[index].teamStats.away.Hitting.SF !== '0' || boxScores[index].teamStats.away.Hitting.SAC !== '0') {
      site = Site.AWAY;
    }
    else if (boxScores[index].teamStats.home.Hitting.SF !== '0' || boxScores[index].teamStats.home.Hitting.SAC !== '0') {
      site = Site.HOME;
    } else {
      site = '' as Site;
    }

    console.log('number of sacrifices', this.boxScores[index].teamStats[site].Hitting);
    const pitchers: PlayerStats[] = boxScores[index].playerStats.filter(({team, allPositionsPlayed}) => boxScores[index][site] !== team && allPositionsPlayed === 'P');

    console.log('pitchers Length: ', pitchers.map(value => value.Pitching.pitchingOrder));
    console.log('pitchers: ', pitchers);

    const battersFaced: number = pitchers.map(({Pitching}) => Pitching["Batters Faced"]).reduce((a, b) => Number(a) + Number(b), 0);

    console.log('batters Faced: ', battersFaced);

  }
}
