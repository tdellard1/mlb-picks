import { Component } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from "@angular/material/button-toggle";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {SubscriptionHolder} from "../../../shared/components/subscription-holder.component.js";
import {ActivatedRoute, Data} from "@angular/router";
import {TeamAnalytics} from "../../../common/model/team-schedule.interface.js";
import {Team} from "../../../common/model/team.interface.js";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'splits',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    MatRadioButton,
    MatRadioGroup,
    NgSelectModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './splits.component.html',
  styleUrl: './splits.component.css'
})
export class SplitsComponent extends SubscriptionHolder {
  teamsMap: Map<string, Team> = new Map();

  split: string;
  homeAnalytics: TeamAnalytics;
  home: Team;

  awayAnalytics: TeamAnalytics;
  away: Team;

  constructor(private activatedRoute: ActivatedRoute) {
    super();

    const teams: Team[] = this.activatedRoute.snapshot.data['teams'] as Team[];
    teams.forEach((team: Team) => this.teamsMap.set(team.teamAbv, team));

    this.subscriptions.push(
      this.activatedRoute.data.subscribe((data: Data) => {
        const teams: string[] = this.activatedRoute.snapshot.params['gameId'].split('_')[1].split('@');
        const {home, away}: any = data['splits'];
        this.home = this.teamsMap.get(teams[0])!;
        this.away = this.teamsMap.get(teams[1])!;
        this.homeAnalytics = new TeamAnalytics(this.home.teamAbv, home);
        this.awayAnalytics = new TeamAnalytics(this.away.teamAbv, away);
      })
    )
  }

  selectSplits() {
    // Not implemented yet
  }
}
