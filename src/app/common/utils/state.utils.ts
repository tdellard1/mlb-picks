import {Roster, RosterPlayer} from "../model/roster.interface";
import {TeamSchedule} from "../model/team-schedule.interface";
import {deepCopy} from "./general.utils";
import {PlayerStats} from "../model/player-stats.interface";
import {Tank01Date} from "./date.utils";
import {Game, LineScore} from "../model/game.interface";
import {BoxScore} from "../model/box-score.interface";

export class StateUtils {
  static batterStreaks(schedules: TeamSchedule[]) {
    const players: RosterPlayer[] = schedules.map((teamSchedule: TeamSchedule) => teamSchedule.teamDetails?.roster!).flat();
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

    const sortedHittingStreams = playersAndHitStreak.sort((a, b) => b.hitStreak - a.hitStreak)

    console.log('sortedHittingStreams: ', sortedHittingStreams);
    return sortedHittingStreams;
  }

  static getHittingStreaks(rosterPlayers: Map<string, RosterPlayer>) {
    const hitters: any[] = [];
    rosterPlayers.forEach((rosterPlayer: RosterPlayer) => {
      let hitStreak = 0;
      const {team, longName, games, gamesMap}: RosterPlayer = rosterPlayer;

      if (games) {
        const gamesCopy = deepCopy(games);
        let game = gamesCopy.pop();
        while (game !== undefined && game?.Hitting.H !== '0') {
          hitStreak++;
          game = gamesCopy.pop();
        }
      }

      hitters.push({longName, team, hitStreak});
    });

    return hitters.sort((a, b) => b.hitStreak - a.hitStreak);
  }

  static sortPlayersGames(schedules: TeamSchedule[], scheduleIndex: number, playerIndex: number) {
    const player: RosterPlayer = schedules[scheduleIndex].teamDetails!.roster![playerIndex];
    const games = deepCopy(player.games);
    schedules[scheduleIndex].teamDetails!.roster![playerIndex].games = games.sort((a: PlayerStats, b: PlayerStats) => {
      const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
      const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

      return aDateObject.timeStamp - bDateObject.timeStamp;
    });
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

    boxScoresOfGames.forEach(({playerStats, lineScore}: BoxScore) => {
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

  static addGamesOfPlayer(playerIdentifier: string, allPlayerStats: Map<string, PlayerStats>): PlayerStats[] {
    const stats: PlayerStats[] = [];

    allPlayerStats.forEach((playerStats: PlayerStats) => {
      if (playerStats.playerID === playerIdentifier) {
        stats.push(playerStats)
      }
    });

    return stats.sort((a: PlayerStats, b: PlayerStats) => {
      const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
      const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

      return aDateObject.timeStamp - bDateObject.timeStamp;
    })
  }

  static playersOnRoster(teamIdentifier: string, allPlayers: Map<string, RosterPlayer>): RosterPlayer[] {
    const players: RosterPlayer[] = [];

    allPlayers.forEach((rosterPlayer: RosterPlayer) => {
      if (rosterPlayer.team === teamIdentifier) {
        players.push(rosterPlayer)
      }
    });

    return players;
  }

  static getNoRunsFirstInningStreak(boxScoreMap: Map<string, BoxScore>, {games, playerID, longName}: RosterPlayer) {
    function pitcherThrewNoRunnerFirstInning({playerStats, lineScore}: BoxScore, playerIdentifier: string) {
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

    const gameIDs: string[] = games?.map(({gameID}: PlayerStats) => gameID)!;
    const boxScoresOfGames: BoxScore[] = gameIDs
      .map((gameID: string) => boxScoreMap.get(gameID)!)
      .sort((a: BoxScore, b: BoxScore) => {
        const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
        const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

        return aDateObject.timeStamp - bDateObject.timeStamp;
      })
      .filter((boxScore: BoxScore) => boxScore.playerStats[playerID].started === 'True');

    let NRFI = 0;

    // @ts-ignore
    let boxScore = boxScoresOfGames.pop();

    if (boxScore) {
      const firstResult: boolean = pitcherThrewNoRunnerFirstInning(boxScore, playerID);
      while (boxScore && firstResult === pitcherThrewNoRunnerFirstInning(boxScore, playerID)) {
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

  static getTeamNRFI(team: string, teamSchedule: TeamSchedule, boxScoresMap: any): string {
    const games: Game[] = teamSchedule.schedule.filter((game: Game) => game.boxScore !== undefined);

    const totalGames = games.length;
    let gamesWithNRFI: number = 0;
    games.forEach(({boxScore}: Game) => {
      if (boxScore?.lineScore) {
        const isAway: boolean = boxScore.lineScore.away.team === team;

        if (isAway && boxScore.lineScore.away.scoresByInning['1'] === '0') {
          gamesWithNRFI++;
        } else if (boxScore.lineScore.home.scoresByInning['1'] === '0') {
          gamesWithNRFI++;
        }
      }
    });

    const NRFIRatio: number = gamesWithNRFI / totalGames;
    const NRFIRatioRounded = NRFIRatio.toFixed(2);
    const NRFIPercentage: number = Number(NRFIRatioRounded) * 100;

    return NRFIPercentage.toString();
  }
}
