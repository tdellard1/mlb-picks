import {BoxScore} from "../model/box-score.interface";
import {RosterPlayer} from "../model/roster.interface";
import {PlayerStats} from "../model/player-stats.interface";

/** Postponed games are the only ones that don't have stats */
export function removePostponedGames(boxScores: BoxScore[]): BoxScore[] {
  return boxScores.filter((boxScore: BoxScore) => {
    return boxScore.gameStatus !== 'Postponed'
  }).filter(Boolean);
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
