import {Hitting} from "../interfaces/hitting.interface.js";
import {Stats} from "../interfaces/stats.interface.js";

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
    }

    finalizeOffensiveStats() {
        this.PlateAppearance = this.AtBats + this.Walks + this.HitByPitch + this.SacrificeFly + this.SacrificeBunt;
        this.Singles = this.Hits - this.Doubles - this.Triples - this.HomeRuns;
    };

    addTeamStatsHitting({Hitting}: Stats) {
        if (validateHittingStats(Hitting)) {
            this.AtBats += Number(Hitting.AB);
            this.Hits += Number(Hitting.H);
            this.Doubles += Number(Hitting['2B']);
            this.Triples += Number(Hitting['3B']);
            this.HomeRuns += Number(Hitting.HR);
            this.IntentionalWalks += Number(Hitting.IBB);
            this.Walks += Number(Hitting.BB);
            this.HitByPitch += Number(Hitting.HBP);
            this.SacrificeFly += Number(Hitting.SF);
            this.SacrificeBunt += Number(Hitting.SAC);
        }

        function validateHittingStats(hitting: Hitting) {
            if (!hitting.AB) {
                // console.log('hitting with undefined AB', hitting);
                throw new Error('required field missing: hitting.AB')
            }
            if (!hitting.H) {
                throw new Error('required field missing: hitting.H')
            }
            if (!hitting['2B']) {
                throw new Error('required field missing: hitting[2B]')
            }
            if (!hitting['3B']) {
                throw new Error('required field missing: hitting[3B]')
            }
            if (!hitting.HR) {
                throw new Error('required field missing: hitting.HR')
            }
            if (!hitting.IBB) {
                throw new Error('required field missing: hitting.IBB')
            }
            if (!hitting.BB) {
                throw new Error('required field missing: hitting.BB')
            }
            if (!hitting.HBP) {
                throw new Error('required field missing: hitting.HBP')
            }
            if (!hitting.SF) {
                throw new Error('required field missing: hitting.SF')
            }
            if (!hitting.SAC) {
                throw new Error('required field missing: hitting.SAC')
            }

            return true;
        }
    }
}