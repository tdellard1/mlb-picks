import { Component } from '@angular/core';
import {SubscriptionHolder} from "./subscription-holder.component";
import {ActivatedRoute} from "@angular/router";
import {Team} from "@common/interfaces/team.interface";
import {Schedule} from "@common/interfaces/team-schedule.interface";
import {BoxScore} from "@common/model/box.score.model";
import {Game} from "@common/interfaces/game";
import {RosterPlayer} from "@common/interfaces/players";

@Component({
  selector: 'stats-supplier',
  standalone: true,
  imports: [],
  template: '',
  styles: ''
})
export class StatsSupplierComponent extends SubscriptionHolder {
  protected readonly teams: Team[] =  this.activatedRoute.snapshot.data['teams'] as Team[];
  protected readonly players: RosterPlayer[] =  this.activatedRoute.snapshot.data['players'] as RosterPlayer[];
  protected readonly schedules: Schedule[] = this.activatedRoute.snapshot.data['schedules'] as Schedule[];
  protected readonly boxScores: BoxScore[] = this.activatedRoute.snapshot.data['boxScores'] as BoxScore[];
  protected readonly dailySchedule: Game[] = this.activatedRoute.snapshot.data['dailySchedule'] as Game[];

  protected readonly teamsMap: Map<string, Team> = new Map((this.teams).map((team: Team) => [team.teamAbv, team]));
  protected readonly playersMap: Map<string, RosterPlayer> = new Map((this.players).map((player: RosterPlayer) => [player.playerID, player]));
  protected readonly schedulesMap: Map<string, Schedule> = new Map((this.schedules).map((schedule: Schedule) => [schedule.team, schedule]));
  protected readonly boxScoresMap: Map<string, BoxScore> = new Map((this.boxScores).map((boxScore: BoxScore) => [boxScore.gameID, boxScore]));
  protected readonly dailyScheduleMap: Map<string, Game> = new Map((this.dailySchedule).map((game: Game) => [game.gameID, game]));

  constructor(private activatedRoute: ActivatedRoute) {
    super();
  }

  getTeam(teamAbbreviation: string) {
    const team: Team | undefined = this.teamsMap.get(teamAbbreviation);

    if (team) {
      return team;
    } else {
      throw new Error('Unable to find a team!');
    }
  }

  getSchedule(teamAbbreviation: string) {
    const schedule: Schedule | undefined = this.schedulesMap.get(teamAbbreviation);

    if (schedule) {
      return schedule;
    } else {
      throw new Error('Unable to find a team!');
    }
  }

  getBoxScore(gameID: string) {
    const boxScore: BoxScore | undefined = this.boxScoresMap.get(gameID);

    if (boxScore) {
      return boxScore;
    } else {
      throw new Error(`Unable to find Box Score ${gameID}`);
    }
  }

  getGame(gameID: string): Game {
    const game: Game | undefined = this.dailyScheduleMap.get(gameID);

    if (game) {
      return game;
    } else {
      throw new Error('Unable to find a team!');
    }
  }
}
