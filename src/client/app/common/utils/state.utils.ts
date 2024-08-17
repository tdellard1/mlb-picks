import {deepCopy} from "./general.utils";
import {Schedule} from "../interfaces/team-schedule.interface";
import {Roster} from "../interfaces/roster";
import {RosterPlayer} from "../interfaces/players";
import {BoxScore} from "../model/box.score.model";
import {PlayerStats} from "../interfaces/player-stats";
import {PlayerStatsUtils} from "./player-stats.utils";

export class StateUtils {
  static batterStreaks(boxScores: BoxScore[], players: RosterPlayer[]): BatterStreak[] {
    const allPlayerStats: PlayerStats[] = boxScores.map(({playerStats}) => playerStats).flat();
    const allPlayersStatsLength: number = allPlayerStats.length;

    const allPlayersContainingStats: Map<string, RosterPlayer> = new Map();

    for (let i = 0; i < allPlayersStatsLength; i++) {
      const playerStats: PlayerStats = allPlayerStats[i];

      const playerFromMap: RosterPlayer | undefined = allPlayersContainingStats.get(playerStats.playerID);
      const playerFromList: RosterPlayer | undefined = players.find(({playerID}) => playerID === playerStats.playerID);
      const defaultPlayer: RosterPlayer = {
        playerID: playerStats.playerID,
        teamID: playerStats.teamID,
        team: playerStats.team,
        pos: playerStats.allPositionsPlayed,
        longName: playerStats.playerID
      } as RosterPlayer;

      const player: RosterPlayer = playerFromMap || playerFromList || defaultPlayer;

      if (!player.games) {
        player.games = [];
      }

      player.games.push(playerStats);

      allPlayersContainingStats.set(playerStats.playerID, player);
    }

    const remapPlayers: Map<string, RosterPlayer> = new Map();

    allPlayersContainingStats.forEach((rosterPlayer: RosterPlayer) => {
      const sortedGames: PlayerStats[] = rosterPlayer.games!.sort(PlayerStatsUtils.sortChronologically);
      const player: RosterPlayer = Object.assign({}, rosterPlayer, {games: sortedGames});

      remapPlayers.set(rosterPlayer.playerID, player);
    });

    return StateUtils.getHittingStreaks(remapPlayers);
  }

  static getHittingStreaks(rosterPlayers: Map<string, RosterPlayer>): BatterStreak[] {
    const hitters: BatterStreak[] = [];
    rosterPlayers.forEach((rosterPlayer: RosterPlayer) => {
      let hitStreak = 0;
      const {team, longName, games}: RosterPlayer = rosterPlayer;

      if (games) {
        const gamesCopy = deepCopy(games);
        let game = gamesCopy.pop();
        while (game !== undefined && game?.Hitting.H !== '0') {
          hitStreak++;
          game = gamesCopy.pop();
        }

        hitters.push({longName, team, hitStreak});
      }
    });

    return hitters.sort((a, b) => b.hitStreak - a.hitStreak);
  }
}

export interface BatterStreak {
  longName: string;
  team: string;
  hitStreak: number;
}