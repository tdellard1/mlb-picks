import {BoxScore} from "../model/box-score.interface.js";
import {PlayerStats} from "../model/player-stats.interface.js";

export class BoxScoreUtils {
  public static getHits(targetedTeam: string, {playerStats, teamStats, home}: BoxScore): number {
    let teamHits: number = 0;
    let teamHitsFromString: number = 0;
    let opponentsGivenUpHits: number = 0;
    let teamStatsHits: number = targetedTeam === home ? Number(teamStats.home.Hitting.H) : Number(teamStats.away.Hitting.H);

    playerStats.forEach((playerStats: PlayerStats) => {
      if (playerStats.team === targetedTeam) {
        teamHits += playerStats.hits;
        teamHitsFromString += Number(playerStats.Hitting.H);
      } else {
        opponentsGivenUpHits += Number(playerStats.Pitching.H);
      }
    });

    const amountOfHits: Set<number> = new Set([teamHits, teamStatsHits, opponentsGivenUpHits, teamStatsHits]);
    if (amountOfHits.size !== 1) {
      console.log('Something does not match...');
      console.log('teamHits: ', teamHits);
      console.log('teamHitsFromString: ', teamHitsFromString);
      console.log('opponentsGivenUpHits: ', opponentsGivenUpHits);
      return 0;
    } else {
      return teamHits;
    }
  }

  public static getAtBats(targetedTeam: string, {playerStats}: BoxScore): number {
    let AtBats: number = 0;


    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        AtBats += Number(Hitting.AB);
      }
    });

    if (AtBats === 0) {
      throw new Error('May be missing some values for AtBats');
    }

    return AtBats;
  }

  public static getPlateAppearances(targetedTeam: string, {playerStats}: BoxScore): number {
    let PlateAppearances: number = 0;


    playerStats.forEach(({Pitching, team}: PlayerStats) => {
      if (team !== targetedTeam) {
        PlateAppearances += Number(Pitching["Batters Faced"]);
      }
    });

    if (PlateAppearances === 0) {
      throw new Error('May be missing some values for PlateAppearances');
    }

    return PlateAppearances;
  }

  public static getHomeRuns(targetedTeam: string, {playerStats}: BoxScore): number {
    let homeRuns: number = 0;


    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        homeRuns += Number(Hitting.HR);
      }
    });

    return homeRuns;
  }

  public static getDoubles(targetedTeam: string, {playerStats}: BoxScore): number {
    let doubles: number = 0;


    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        doubles += Number(Hitting["2B"]);
      }
    });

    return doubles;
  }

  public static getTriples(targetedTeam: string, {playerStats}: BoxScore): number {
    let triples: number = 0;


    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        triples += Number(Hitting["3B"]);
      }
    });

    return triples;
  }

  public static getTotalWalks(targetedTeam: string, {teamStats, playerStats, home, away}: BoxScore): number {
    let walks: number = 0;

    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        walks += Number(Hitting.BB);
      }
    });

    if (home === targetedTeam && Number(teamStats.home.Hitting.BB) !== walks) {
      console.log('walks don\'t match');
    }

    if (away === targetedTeam && Number(teamStats.away.Hitting.BB) !== walks) {
      console.log('walks don\'t match');
    }

    return walks;
  }

  public static getIntendedWalks(targetedTeam: string, {playerStats}: BoxScore): number {
    let unintentionalWalks: number = 0;

    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        unintentionalWalks += Number(Hitting.IBB);
      }
    });

    return unintentionalWalks;
  }

  public static getSingles(targetedTeam: string, boxScore: BoxScore): number {
    const hits: number = BoxScoreUtils.getHits(targetedTeam, boxScore);
    const doubles: number = BoxScoreUtils.getDoubles(targetedTeam, boxScore);
    const triples: number = BoxScoreUtils.getTriples(targetedTeam, boxScore);
    const homeRuns: number = BoxScoreUtils.getHomeRuns(targetedTeam, boxScore);

    return hits - (doubles + triples + homeRuns);
  }

  static getHitByPitch(targetedTeam: string, {playerStats}: BoxScore) {
    let unintentionalWalks: number = 0;

    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        unintentionalWalks += Number(Hitting.HBP);
      }
    });

    return unintentionalWalks;
  }

  static getSacrificeFly(targetedTeam: string, {playerStats}: BoxScore) {
    let unintentionalWalks: number = 0;

    playerStats.forEach(({Hitting, team}: PlayerStats) => {
      if (team === targetedTeam) {
        unintentionalWalks += Number(Hitting.SF);
      }
    });

    return unintentionalWalks;
  }
}