import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {Game, Games} from "../../../common/model/game.interface";
import {AsyncPipe, JsonPipe, NgIf, NgOptimizedImage} from "@angular/common";
import {SubscriptionHolder} from "../../../common/components/subscription-holder.component";
import {StateService} from "../../../common/services/state.service";
import {RosterPlayer} from "../../../common/model/roster.interface";
import {MatDivider} from "@angular/material/divider";
import {Team} from "../../../common/model/team.interface";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";

export interface NoRunsFirstInningElements {
  teamAbv: string;
  pitcher: string;
  record24: string;
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
  displayedColumns: string[] = ['teamAbv', 'pitcher', 'record24', 'streak', 'oppTeamAbv', 'oppNRFIpct', 'oppStreak'];
  dailySchedule: Game[] = [];
  players: Map<string, RosterPlayer> = new Map<string, RosterPlayer>();
  teams: Map<string, Team> = new Map<string, Team>();
  dataSource: NoRunsFirstInningElements[] = [];

  constructor(private route: ActivatedRoute,
              private stateService: StateService) {
    super();
    this.subscriptions.push(this.route.parent!.parent!.data.subscribe((data: Data) => this.dailySchedule = data['dailySchedule']));
  }

  ngOnInit(): void {
    this.players = this.stateService.allPlayers;
    this.teams = this.stateService.allTeams;

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
    const pitcher: RosterPlayer | undefined = this.players.get(pitcherID);
    retVal.teamAbv = primaryTeam;

    if (pitcher) {
      retVal.pitcher = pitcher.longName;
      retVal.record24 = this.get24NRFI(pitcher);
      retVal.streak = this.getNRFIStreak(pitcher);
    } else {
      retVal.pitcher = '';
      retVal.record24 = '0 - 0';
      retVal.streak = '0';
    }

    retVal.oppTeamAbv = secondaryTeam;
    retVal.oppNRFIpct = this.getTeamNRFI(secondaryTeam);
    retVal.oppStreak = '0';
    return retVal;
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  get24NRFI(rosterPlayer: RosterPlayer): string {
    return this.stateService.getPitcherNRFIRecord(rosterPlayer);
  }

  getNRFIStreak(rosterPlayer: RosterPlayer): string {
    return this.stateService.getNRFIStreak(rosterPlayer);
  }

  getTeamNRFI(team: string) {
    return this.stateService.getTeamNRFI(team);
  }

  getTeamLogo(teamName: string) {
    const team: Team = this.teams.get(teamName)!;
    return team.espnLogo1;
  }
}
