import {RosterPlayer} from "../model/roster.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {deepCopy} from "./general.utils";
import {PlayerStats} from "../model/player-stats.interface";
import {Tank01Date} from "./date.utils";
import {Game} from "../model/game.interface";
import {BoxScore} from "../model/box-score.interface";

export class StateUtils {
  static batterStreaks(schedules: TeamSchedule[]) {
    const players: RosterPlayer[] = schedules.map((teamSchedule: TeamSchedule) => teamSchedule.teamDetails!.roster!).flat();
    const nonPitchingPlayers: RosterPlayer[] = players.filter(({pos}: RosterPlayer) => pos.toUpperCase() !== 'P');
    const playersAndHitStreak = nonPitchingPlayers.map(({team, longName, games, gamesMap}: RosterPlayer) => {

      const player = longName;
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

  static getNoRunsFirstInningRecord(boxScoreMap: Map<string, BoxScore>, {games, playerID, longName}: RosterPlayer) {
    if (games === undefined) {
      console.log('gameIDs is null: ', longName, playerID, games);
      return '0 - 0';
    }

    const gameIDs: string[] = games?.map(({gameID}: PlayerStats) => gameID)!;
    const boxScoresOfGames: BoxScore[] = gameIDs.map((gameID: string) => boxScoreMap.get(gameID)!);

    let NRFI = 0;
    let YRFI = 0;

    boxScoresOfGames.filter(value => !!value).forEach(({playerStats, lineScore}: BoxScore) => {
      const {started, team}: PlayerStats = playerStats[playerID];

      if (started === 'True' && lineScore) {
        if (lineScore.away.team === team) {
          if (lineScore.home.scoresByInning['1'] == '0') {
            NRFI++;
          } else {
            YRFI++;
          }
        }
        if (lineScore.home.team === team) {
          if (lineScore.away.scoresByInning['1'] == '0') {
            NRFI++;
          } else {
            YRFI++;
          }
        }
      }
    });

    return `${NRFI} - ${YRFI}`;
  }

  static getNoRunsFirstInningStreak(boxScoreMap: Map<string, BoxScore>, {games, playerID, longName}: RosterPlayer) {
    function pitcherThrewNoRunnerFirstInning({playerStats, lineScore}: BoxScore) {
      const {team}: PlayerStats = playerStats[playerID];

      if (lineScore.away.team === team) {
        return lineScore.home.scoresByInning['1'] === '0';
      } else if (lineScore.home.team === team) {
        return lineScore.away.scoresByInning['1'] === '0';
      } else {
        throw new Error('Pitcher did not play for home team or away team');
      }
    }

    if (games === undefined) {
      console.log('gameIDs is null: ', longName);
      return '0';
    }

    const gameIDs: string[] = games!.map(({gameID}: PlayerStats) => gameID)!;
    const boxScoresOfGames: BoxScore[] = gameIDs
      .map((gameID: string) => boxScoreMap.get(gameID)!)
      /** TODO: I need to make this undefined check because it breaks app, figure out why and how to prevent it at a higher level*/
      .filter((boxScore: BoxScore) => !!boxScore)
      .sort((a: BoxScore, b: BoxScore) => {
        const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
        const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

        return aDateObject.timeStamp - bDateObject.timeStamp;
      })
      .filter((boxScore: BoxScore) => boxScore.playerStats[playerID].started === 'True');

    let NRFI = 0;

    let boxScore: BoxScore | undefined = boxScoresOfGames.pop();

    if (boxScore) {
      const firstResult: boolean = pitcherThrewNoRunnerFirstInning(boxScore);
      while (boxScore && firstResult === pitcherThrewNoRunnerFirstInning(boxScore)) {
        if (firstResult) {
          NRFI++;
        } else {
          --NRFI;
        }
        boxScore = boxScoresOfGames.pop();
      }
    }

    return `${NRFI}`;
  }

  static getTeamNRFI(team: string, {schedule}: TeamSchedule): string {
    const games: Game[] = schedule.filter(({boxScore}: Game) => boxScore !== undefined);

    const totalGames = games.length;
    let gamesWithNRFI: number = 0;
    games.forEach(({boxScore}: Game) => {
      if (boxScore?.lineScore) {
        const isAway: boolean = boxScore.lineScore.away.team === team;
        const isHome: boolean = boxScore.lineScore.home.team === team;

        if (isAway && boxScore.lineScore.away.scoresByInning['1'] === '0') {
          gamesWithNRFI++;
        } else if (isHome && boxScore.lineScore.home.scoresByInning['1'] === '0') {
          gamesWithNRFI++;
        }
      }
    });

    const NRFIRatio: number = gamesWithNRFI / totalGames;
    const NRFIPercentage: number = NRFIRatio * 100;
    return NRFIPercentage.toFixed(2);
  }
}
