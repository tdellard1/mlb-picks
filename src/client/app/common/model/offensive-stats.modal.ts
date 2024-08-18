import {TeamStatsHitting} from "./team-stats.model.js";
import {WeightedFactors} from "../constants/weighted-factors.constants.js";

export class OffensiveStats {
  AtBats: number;
  PlateAppearance: number;
  Hits: number;
  Singles: number;
  Doubles: number;
  Triples: number;
  HomeRuns: number;
  IntentionalWalks: number;
  Walks: number;
  HitByPitch: number;
  SacrificeFly: number;
  SacrificeBunt: number;
  gamesRepresentedInData: number;

  constructor() {
    this.AtBats = 0;
    this.PlateAppearance = 0;
    this.Hits = 0;
    this.Singles = 0;
    this.Doubles = 0;
    this.Triples = 0;
    this.HomeRuns = 0;
    this.IntentionalWalks = 0;
    this.Walks = 0;
    this.HitByPitch = 0;
    this.SacrificeFly = 0;
    this.SacrificeBunt = 0;
    this.gamesRepresentedInData = 0;
  }

  add(offensiveStats: OffensiveStats) {
    this.AtBats += offensiveStats.AtBats;
    this.PlateAppearance += offensiveStats.PlateAppearance;
    this.Hits += offensiveStats.Hits;
    this.Singles += offensiveStats.Singles;
    this.Doubles += offensiveStats.Doubles;
    this.Triples += offensiveStats.Triples;
    this.HomeRuns += offensiveStats.HomeRuns;
    this.IntentionalWalks += offensiveStats.IntentionalWalks;
    this.Walks += offensiveStats.Walks;
    this.HitByPitch += offensiveStats.HitByPitch;
    this.SacrificeFly += offensiveStats.SacrificeFly;
  }

  addTeamStatsHitting({AB, avg, D, BB, HR, H, HBP, IBB, R, SO, RBI, T, SAC, SF, TB, GIDP}: TeamStatsHitting) {
    this.AtBats += AB;
    this.Hits += H;
    this.Doubles += D;
    this.Triples += T;
    this.HomeRuns += HR;
    this.IntentionalWalks += IBB;
    this.Walks += BB;
    this.HitByPitch += HBP;
    this.SacrificeFly += SF;
    this.SacrificeBunt += SAC;
  }

  finalize(dataQuantity: number) {
    this.PlateAppearance = this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly + this.SacrificeBunt;
    this.Singles = this.Hits - this.Doubles - this.Triples - this.HomeRuns;
    this.gamesRepresentedInData = dataQuantity;
  }

  get BattingAverage(): string {
    const AVG: number = this.Hits / this.AtBats;
    return AVG.toFixed(3);
  }

  // OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
  get OnBasePercentage() {
    const OBP: number = (this.Hits + this.Walks + this.HitByPitch) / (this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly);
    return OBP.toFixed(3);
  }

  // (1B + 2Bx2 + 3Bx3 + HRx4)/AB
  get Slugging() {
    const SLG: number = (this.Singles + (this.Doubles * 2) + (this.Triples * 3) + (this.HomeRuns * 4)) / this.AtBats;
    return SLG.toFixed(3);
  }

  get OnBasePlusSlugging() {
    const OBP: number = (this.Hits + this.Walks + this.HitByPitch) / (this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly);
    const SLG: number = (this.Singles + (this.Doubles * 2) + (this.Triples * 3) + (this.HomeRuns * 4)) / this.AtBats;
    const OPS: number = OBP + SLG;
    return OPS.toFixed(3);
  }

  get weightedOnBaseAverage() {
    return this.weightedOnBaseAverageNumber.toFixed(3);
  }

  // wOBA = (0.690×uBB + 0.722×HBP + 0.888×1B + 1.271×2B + 1.616×3B +2.101×HR) / (AB + BB – IBB + SF + HBP)
  get weightedOnBaseAverageNumber() {
    const weightedWalks: number = (this.Walks - this.IntentionalWalks) * WeightedFactors.wBB;
    const weightedHitByPitch: number = this.HitByPitch * WeightedFactors.wHBP;
    const weightedSingles: number = this.Singles * WeightedFactors.w1B;
    const weightedDoubles: number = this.Doubles * WeightedFactors.w2B;
    const weightedTriples: number = this.Triples * WeightedFactors.w3B;
    const weightedHomeRuns: number = this.HomeRuns * WeightedFactors.wHR;


    return (weightedWalks + weightedHitByPitch + weightedSingles + weightedDoubles + weightedTriples + weightedHomeRuns) /
      (this.AtBats + this.Walks - this.IntentionalWalks + this.SacrificeFly + this.HitByPitch);
  }

  // wRC = (((wOBA – League wOBA/wOBA Scale) + (League R/PA)) * PA
  get weightedRunsCreated() {
    const firstPart = (this.weightedOnBaseAverageNumber - WeightedFactors.wOBA)/WeightedFactors.wOBAScale;
    const secondPart = WeightedFactors.RoPA / this.PlateAppearance;

    return ((firstPart + WeightedFactors.RoPA) * this.PlateAppearance).toFixed(2);
  }
}