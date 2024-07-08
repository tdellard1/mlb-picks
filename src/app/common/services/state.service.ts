import {Injectable} from '@angular/core';
import {deepCopy} from "../utils/general.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {Team, Teams} from "../model/team.interface";
import {Player} from "../model/players.interface";
import {Roster, RosterPlayer} from "../model/roster.interface";
import {BoxScore} from "../model/box-score.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {Game} from "../model/game.interface";
import {AnalysisUtils} from "../utils/analysis.utils";
import {mergeAll, mergeMap, of, toArray} from "rxjs";
import {Tank01ApiService} from "./api-services/tank01-api.service";
import {BackendApiService} from "./backend-api/backend-api.service";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  public _schedules: TeamSchedule[] = [];
  public schedules_: Map<string, TeamSchedule> = new Map<string, TeamSchedule>();

  private _teams: Team[] = [];
  private teams_: Map<string, Team> = new Map<string, Team>();

  private _rosters: Roster[] = [];
  private rosters_: Map<string, RosterPlayer[]> = new Map<string, RosterPlayer[]>();

  private _boxScores: BoxScore[] = [];
  private _playerStats: PlayerStats[] = [];


  constructor(private tank01ApiService: Tank01ApiService,
              private backendApiService: BackendApiService) {}

  // Step 5
  build() {
    const gameIDsToRetrieve: string[] = [];

    this._schedules.forEach((teamSchedule) => {
      const {schedule}: TeamSchedule = deepCopy(teamSchedule);

      // remove games from start of schedule that do not have boxScores
      while (schedule.shift()?.boxScore === undefined) {}

      // Starting with games with boxScores, get all games before today that do not have box scores
      const gameIDs: string[] = schedule
        .filter(AnalysisUtils.gamesBeforeToday)
        .filter(({boxScore}: Game) => !boxScore)
        .map(({gameID}) => gameID);

      gameIDsToRetrieve.push(...gameIDs)
      this.schedules_.set(teamSchedule.team, teamSchedule);
    });

    if (gameIDsToRetrieve.length > 0) {
      of(new Set(gameIDsToRetrieve)).pipe(
        mergeAll(),
        mergeMap((gameID: string) => this.tank01ApiService.getBoxScoreForGame(gameID)),
        toArray()
      ).subscribe((newBoxScores: BoxScore[]) => {
        this._boxScores.push(...newBoxScores);

        this.backendApiService.updateBoxScoresOnly(this._boxScores).subscribe(value => console.log('updated BoxScores? ', value));
      });
    }
  }

// Step 4
  addSchedules(schedules: TeamSchedule[]): any {
    this._schedules = schedules;

    schedules.forEach((schedule: TeamSchedule) => {
      // Add BoxScores to Schedule Games
      schedule.schedule.forEach((game: Game) => {
        const boxScoreIndex = this._boxScores.findIndex((boxScore: BoxScore) => boxScore.gameID === game.gameID);

        if (boxScoreIndex !== -1) {
          game.boxScore = this._boxScores[boxScoreIndex];
        }
      });

      // Add Team Details to Schedule
      const teamAbr: string = schedule.team;
      const teamDetails = this.teams_.get(teamAbr);
      if (teamDetails) {
        schedule.teamDetails = teamDetails;
      }

      // this.schedules_.set(teamAbr, schedule);
    });

    return this;
  }


  // Step 3
  addTeams(teams: Team[]) {
    this._teams = teams;
    this._teams.forEach((team: Team) => {
      const rosterPlayers: RosterPlayer[] | undefined = this.rosters_.get(team.teamAbv);
      if (rosterPlayers) {
        team.roster = rosterPlayers;
      }

      this.teams_.set(team.teamAbv, team);
    });

    return this;
  }

  // Step 2
  addRosters(rosters: Roster[]): this {
    this._rosters = rosters;
    this._rosters.forEach(({roster, team}: Roster) => {
      const playersOnTeam: PlayerStats[] = this._playerStats.filter((playerStats: PlayerStats) => playerStats.team === team);

      playersOnTeam.forEach((player: PlayerStats) => {
        const matchingRosterPlayer: RosterPlayer | undefined = roster.find(({playerID}: RosterPlayer) => player.playerID === playerID);

        if (matchingRosterPlayer) {
          if (matchingRosterPlayer.games === undefined) {
            matchingRosterPlayer.games = [];
          }

          const hasNoGame = matchingRosterPlayer.games.findIndex(value => value['gameID'] === player.gameID) === -1;

          if (hasNoGame) {
            matchingRosterPlayer.games.push(player);
          }
        }
      });

      this.rosters_.set(team, roster);
    });

    return this;
  }

  // Step 1:
  addBoxScores(boxScores: BoxScore[]): this {
    this._boxScores = boxScores;
    const playerStatsPerGame: { [playerId: string]: PlayerStats }[] = this._boxScores
      .filter(({playerStats}: BoxScore) => !!playerStats)
      .map(({playerStats}: BoxScore) => playerStats);

    playerStatsPerGame.forEach((playerStats: { [playerId: string]: PlayerStats }) =>
      Object.values(playerStats).forEach((player: PlayerStats) => {
        if (player) {
          this._playerStats.push(player);
        }
      }));

    return this;
  }
}

