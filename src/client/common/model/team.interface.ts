import {GameStats} from "./game-stats.interface";
import {Game} from "./game.interface";
import {RosterPlayer} from "./roster.interface";

export class Teams {
 teams: Team[];

  constructor(teams: Team[]) {
    this.teams = teams;
  }

  getTeamFullName(teamAbv: string) {
    return `${this.getTeamCity(teamAbv)} ${this.getTeamName(teamAbv)}`;
  }

  getTeamCity(teamAbv: string) {
    const {teamCity}: Team = this.getTeam(teamAbv);
    return teamCity;
  }

  getTeamName(teamAbv: string) {
    const {teamName}: Team = this.getTeam(teamAbv);
    return teamName;
  }

  getTeamWins(teamAbv: string) {
    const {wins}: Team = this.getTeam(teamAbv);
    return wins;
  }

  getTeamLoss(teamAbv: string) {
    const {loss}: Team = this.getTeam(teamAbv);
    return loss;
  }

  getHomeTeamLoss({home}: Game) {
    return this.getTeamLoss(home);
  }

  getAwayTeamLoss({away}: Game) {
    return this.getTeamLoss(away);
  }

  getHomeTeamWins({home}: Game) {
    return this.getTeamWins(home);
  }

  getAwayTeamWins({away}: Game) {
    return this.getTeamWins(away);
  }

  getHomeTeamName({home}: Game) {
    return this.getTeamName(home);
  }

  getAwayTeamName({away}: Game) {
    return this.getTeamName(away);
  }

  getHomeTeamCity({home}: Game) {
    return this.getTeamCity(home);
  }

  getAwayTeamCity({away}: Game) {
    return this.getTeamCity(away);
  }

  getTeam(teamAbv: string): Team {
    const team: Team | undefined = this.teams.find((team: Team) => team.teamAbv === teamAbv);
    if (team === undefined) throw new Error(`No such team: ${teamAbv}`);

    return team;
  }
}

export interface Team {
  teamAbv: string;
  teamCity: string;
  RS: string;
  loss: string;
  teamName: string;
  mlbLogo1: string;
  DIFF: string;
  teamID: string;
  division: string;
  RA: string;
  conferenceAbv: string;
  espnLogo1: string;
  wins: string;
  conference: string;
  topPerformers: GameStats;
  teamStats: GameStats;
  roster?: RosterPlayer[];
}
