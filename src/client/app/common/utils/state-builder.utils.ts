import {BoxScore} from "../model/box-score.interface";
import {RosterPlayer} from "../model/roster.interface";
import {PlayerStats} from "../model/player-stats.interface";
import {Team} from "../model/team.interface";
import {StateUtils} from "./state.utils";
import {TeamSchedule} from "../model/team-schedule.interface";
import {Game} from "../model/game.interface";
import {Tank01Date} from "./date.utils";

/** Postponed games are the only ones that don't have stats */
export function removePostponedGames(boxScores: BoxScore[]): BoxScore[] {
  const returnArray: BoxScore[] = [];
  const arrayLength: number = boxScores.length;

  for (let i: number = 0; i < arrayLength; i++) {
    if (boxScores[i].gameStatus !== 'Postponed' && boxScores[i].gameStatus !== 'Suspended') {
      returnArray.push(boxScores[i]);
    }
  }

  return returnArray
}

export function createRosterPlayerAndAddToMap(
  players: RosterPlayer[],
  playerStats: PlayerStats[],
  activeRoster: Map<string, RosterPlayer>,
  _rosterPlayers: Map<string, RosterPlayer>): void {
  players.forEach((player: RosterPlayer) => {
    const rosterPlayer: RosterPlayer | undefined = activeRoster.get(player.playerID);

    if (rosterPlayer) {
      const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === rosterPlayer.playerID);
      if (gamesForPlayer.length) {
        rosterPlayer.games = gamesForPlayer;
      }
      _rosterPlayers.set(rosterPlayer.playerID, rosterPlayer);
    } else {
      const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === player.playerID);
      if (gamesForPlayer.length) {
        player.games = gamesForPlayer;
      }
      _rosterPlayers.set(player.playerID, player);
    }
  });
}

export function createRosterPlayerMap(
  players: RosterPlayer[],
  playerStats: PlayerStats[],
  activeRoster: Map<string, RosterPlayer>): Map<string, RosterPlayer> {

  return new Map(players.map((player: RosterPlayer) => {
    const rosterPlayer: RosterPlayer | undefined = activeRoster.get(player.playerID);


    if (rosterPlayer) {
      const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === rosterPlayer.playerID);

      if (gamesForPlayer.length) {
        rosterPlayer.games = gamesForPlayer.sort(sortByGameDate());
      }
      return ([rosterPlayer.playerID, rosterPlayer]);
    } else {
      const gamesForPlayer: PlayerStats[] = playerStats.filter(({playerID}) => playerID === player.playerID);
      if (gamesForPlayer.length) {
        player.games = gamesForPlayer.sort(sortByGameDate());
      }
      return ([player.playerID, player]);
    }
  }));
}

export function addPlayersToTeamRoster(teams: Team[], rosterPlayers: Map<string, RosterPlayer>) {
  return teams.map((team: Team) => {
    const players: RosterPlayer[] = [];

    rosterPlayers.forEach((rosterPlayer: RosterPlayer) => {
      if (rosterPlayer.team === team.teamAbv) {
        players.push(rosterPlayer)
      }
    });

    team.roster = players;

    return team;
  });
}

export function addTeamsAndBoxScoresToSchedule(schedules: TeamSchedule[], teams: Map<string, Team>, boxScores: Map<string, BoxScore>) {
  return schedules.map((teamSchedule: TeamSchedule) => {
    /** Add Teams To Schedule */
    if (teams.has(teamSchedule.team)) {
      teamSchedule.teamDetails = teams.get(teamSchedule.team);
    }

    /** Add BoxScores To Schedule */
    teamSchedule.schedule = teamSchedule.schedule.map((game: Game) => {
      if (boxScores.has(game.gameID)) {
        game.boxScore = boxScores.get(game.gameID);
      }

      return game;
    });

    return teamSchedule;
  });
}

export function sortByGameDate() {
  return (a: PlayerStats, b: PlayerStats) => {
    const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
    const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

    return aDateObject.timeStamp - bDateObject.timeStamp;
  };
}
