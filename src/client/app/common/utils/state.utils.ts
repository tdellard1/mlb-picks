import {deepCopy} from "./general.utils";
import {Schedule} from "../interfaces/team-schedule.interface";
import {Roster} from "../interfaces/roster";
import {RosterPlayer} from "../interfaces/players";

export class StateUtils {
  static batterStreaks(schedules: Schedule[]) {
    const rosters: Roster[] = schedules.map((teamSchedule: Schedule) => teamSchedule.teamDetails!.roster!).flat();
    const players: RosterPlayer[] = rosters.map(({roster}: Roster) => roster).flat();
    const nonPitchingPlayers: RosterPlayer[] = players.filter(({pos}: RosterPlayer) => pos.toUpperCase() !== 'P');
    const playersAndHitStreak = nonPitchingPlayers.map(({team, longName, games, gamesMap}: RosterPlayer) => {

      const player: string = longName;
      let hitStreak: number = 0;
      if (games) {
        const gamesCopy = deepCopy(games)
        let game = gamesCopy.pop();
        while (game !== undefined && game?.Hitting.H !== '0') {
          hitStreak++;
          game = gamesCopy.pop();
        }
      }

      return {player, team, hitStreak};
    });

    return playersAndHitStreak.sort((a, b) => b.hitStreak - a.hitStreak);
  }

  static getHittingStreaks(rosterPlayers: Map<string, RosterPlayer>) {
    const hitters: any[] = [];
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
