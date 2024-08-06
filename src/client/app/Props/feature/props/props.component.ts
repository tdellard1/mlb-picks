import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Game, Games} from "../../../common/model/game.interface";
import {AsyncPipe, JsonPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {MatDivider} from "@angular/material/divider";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {TeamsNRFIPercentage} from "../../../common/services/backend-api/backend-api.service.js";
import {Team} from "../../../common/model/team.interface.js";

export interface NoRunsFirstInningElements {
  teamAbv: string;
  pitcher: string;
  record: string;
  streak: string;
  oppTeamAbv: string;
  oppNRFIpct: string;
  oppStreak: string;
}

@Component({
  selector: 'props',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    JsonPipe,
    MatDivider,
    NgOptimizedImage,
    MatTable,
    MatColumnDef,
    MatCell,
    MatHeaderCell,
    MatRow,
    MatHeaderRow,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRowDef,
    MatRowDef,
  ],
  templateUrl: './props.component.html',
  styleUrl: './props.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropsComponent extends SubscriptionHolder implements OnDestroy, OnInit {
  displayedColumns: string[] = ['teamAbv', 'pitcher', 'record', 'streak', 'oppTeamAbv', 'oppNRFIpct', 'oppStreak'];
  pitcherData: { [playerId: string]: NoRunsFirstInningElements };
  teamNRFIData: {[team: string]: string};
  dailySchedule: Game[] = [];
  teams: Team[];
  dataSource: NoRunsFirstInningElements[] = [];

  constructor(private route: ActivatedRoute) {
    super();

    this.subscriptions.push(
      this.route.data.subscribe((data: Data) => {
        this.teams = data['teams'] as Team[];
        this.dailySchedule = data['dailySchedule'] as Game[];
        this.pitcherData = data['pitchers'] as { [playerId: string]: NoRunsFirstInningElements };
        this.teamNRFIData = data['teamsNoRunsFirstInning'] as TeamsNRFIPercentage;
      }),
    );
  }

  ngOnInit(): void {
    new Games(this.dailySchedule).sortedGames.forEach(({away, home, probableStartingPitchers}: Game) => {
      if (probableStartingPitchers.away || probableStartingPitchers.home) {
        const awayRow: NoRunsFirstInningElements = this.getNoRunsFirstInningLineData(probableStartingPitchers.away, away, home);
        const homeRow: NoRunsFirstInningElements = this.getNoRunsFirstInningLineData(probableStartingPitchers.home, home, away);

        this.dataSource.push(awayRow);
        this.dataSource.push(homeRow);
      }
    })
  }

  private getNoRunsFirstInningLineData(pitcherID: string, primaryTeam: string, secondaryTeam: string) {
    const retVal: NoRunsFirstInningElements = {} as NoRunsFirstInningElements;
    const pitcherData: NoRunsFirstInningElements = this.pitcherData[pitcherID];
    retVal.teamAbv = primaryTeam;

    if (pitcherData) {
      retVal.pitcher = pitcherData.pitcher;
      retVal.record = pitcherData.record;
      retVal.streak = pitcherData.streak;
    } else {
      retVal.pitcher = '-';
      retVal.record = '0 - 0';
      retVal.streak = '0';
    }

    retVal.oppTeamAbv = secondaryTeam;
    retVal.oppNRFIpct = this.teamNRFIData[secondaryTeam];
    retVal.oppStreak = '0';
    return retVal;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  getTeamLogo(teamName: string) {
    const team: Team = this.teams.find(({teamAbv}) => teamAbv === teamName)!;
    return team.espnLogo1;
  }
}
