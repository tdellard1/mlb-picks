import {TeamStatsHitting} from "./team-stats.model.js";
import {WeightedFactors} from "../constants/weighted-factors.constants.js";
import {Pitching} from "../interfaces/pitching";
import {H, R} from "@angular/cdk/keycodes";

export class PitcherStats {
  pitchesThrown: number;
  strikesThrown: number;
  hitsAllowed: number;
  homeRunsAllowed: number;
  walksAllowed: number;
  earnedRuns: number;
  runsAllowed: number;
  inningsPitched: number;
  hitByPitch: number;
  strikeOuts: number;
  totalGames: number;
  earnedRunAverage: number;
  // Balk: number;
  // ['Wild Pitch']: number;
  // Flyouts: number;
  // ['Inherited Runners']: number;
  // ['Inherited Runners Scored']: number;
  // Groundouts: number;
  // ['Batters Faced']: number;
  // WHIP: number;
  // Win: number;
  // Loss: number;

  constructor() {
    this.pitchesThrown = 0;
    this.strikesThrown = 0;
    this.hitsAllowed = 0;
    this.homeRunsAllowed = 0;
    this.walksAllowed = 0;
    this.earnedRuns = 0;
    this.runsAllowed = 0;
    this.inningsPitched = 0;
    this.hitByPitch = 0;
    this.strikeOuts = 0;
    this.totalGames = 0;
    this.earnedRunAverage = 0;
    // this["Wild Pitch"] = 0;
    // this.Flyouts = 0;
    // this["Inherited Runners"] = 0;
    // this.Balk = 0;
    // this["Inherited Runners Scored"] = 0;
    // this.Groundouts = 0;
    // this["Batters Faced"] = 0;
    // this.WHIP = 0;
    // this.Win = 0;
    // this.Loss = 0;
  }

  add({Pitches, Strikes, H, HR, BB, ER, R, InningsPitched, HBP, SO}: Pitching) {
    this.pitchesThrown += Number(Pitches);
    this.strikesThrown += Number(Strikes);
    this.hitsAllowed += Number(H);
    this.homeRunsAllowed += Number(HR);
    this.walksAllowed += Number(BB);
    this.earnedRuns += Number(ER);
    this.runsAllowed += Number(R);
    this.hitByPitch += Number(HBP);
    this.strikeOuts += Number(SO);

    this.addInningsPitched((InningsPitched as string).split('.'));
  }

  addInningsPitched([innings, outs]: string[]) {
    this.inningsPitched += Number(innings);
    this.inningsPitched += (Number(outs) / 3);
  }

  finalize(dataQuantity: number) {
    this.totalGames = dataQuantity;
    this.earnedRunAverage = (this.earnedRuns / this.inningsPitched) * 9;
  }

  get ERA() {
    const era: number = (this.earnedRuns / this.inningsPitched) * 9;
    return isNaN(era) ? '0' : era.toFixed(2);
  }

  get WHIP() {
    const WH: number = this.walksAllowed + this.hitsAllowed;
    const WHIP: number = WH / this.inningsPitched;
    return isNaN(WHIP) ? '0' : WHIP.toFixed(2);
  }

  // ((HR x 13) + (3 x (BB + HBP)) - (2 x K)) / IP + FIP constant.
  get FIP() {
    const homeRunMetric: number = this.homeRunsAllowed * 13;
    const hitByPitchAndWalkMetric: number = (this.hitByPitch + this.walksAllowed) * 3;
    const strikeOutMetric: number = this.strikeOuts * 2;
    const numerator: number = homeRunMetric + hitByPitchAndWalkMetric - strikeOutMetric;
    const FIP: number = (numerator / this.inningsPitched) + WeightedFactors.cFIP;
    return isNaN(FIP) ? '0' : FIP.toFixed(2);
  }

  get homeRunsPer9() {
    const HRp9: number = (this.homeRunsAllowed / this.inningsPitched) * 9
    return isNaN(HRp9) ? '0' : HRp9.toFixed(2);
  }

  get hitsPer9() {
    const Hp9: number = (this.hitsAllowed / this.inningsPitched) * 9
    return isNaN(Hp9) ? '0' : Hp9.toFixed(2);
  }

  get baseRunnersPer9() {
    const baseRunners: number = this.hitsAllowed + this.walksAllowed + this.hitByPitch;
    const BRp9: number = (baseRunners / this.inningsPitched) * 9;
    return isNaN(BRp9) ? '0' : BRp9.toFixed(2);
  }
}