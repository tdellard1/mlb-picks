import {RosterPlayer} from "../models/players/roster-player.model.js";
import {PlayerStats} from "../models/boxScores/player-stats.model.js";
import {Schedule} from "../models/schedules/schedule.model.js";
import {Game} from "../models/schedules/games/game.model.js";
import {BoxScore} from "../models/boxScores/box-scores.model.js";
import {Sites} from "../models/interfaces/teams.interface.js";
import {LineScore} from "../models/interfaces/line-score.interface.js";

export class PitcherUtils {
    gamesMap: Map<string, (Game | BoxScore)> = new Map();

    constructor(schedules: Schedule[], boxScores: BoxScore[]) {
        const allGames: Game[] = schedules.map(({schedule}: Schedule) => schedule).flat();
        const gamesWithLineScores: Game[] = allGames.filter(({lineScore}) => !!lineScore);
        const gamesLength: number = gamesWithLineScores.length;
        for (let i: number = 0; i < gamesLength; i++) {
            const game: Game = gamesWithLineScores[i];
            this.gamesMap.set(game.gameID, game);
        }

        for (const boxScore of boxScores) {
            this.gamesMap.set(boxScore.gameID, boxScore);
        }
    }

    getNoRunsFirstInningRecord({games}: RosterPlayer) {
        let noRunsFirstInning: number = 0;
        let yesRunsFirstInning: number = 0;

        if (games === undefined) {
            return `${noRunsFirstInning} - ${yesRunsFirstInning}`;
        }

        games.forEach(({started, team, gameID}: PlayerStats) => {
            if (this.gamesMap.has(gameID)) {
                const {lineScore}: (Game | BoxScore) = this.gamesMap.get(gameID)!;

                if (started === 'True' && lineScore) {
                    if (lineScore.away.team === team) {
                        if (lineScore.home.scoresByInning['1'] == '0') {
                            noRunsFirstInning++;
                        } else {
                            yesRunsFirstInning++;
                        }
                    }
                    if (lineScore.home.team === team) {
                        if (lineScore.away.scoresByInning['1'] == '0') {
                            noRunsFirstInning++;
                        } else {
                            yesRunsFirstInning++;
                        }
                    }
                }
            }
        });

        return `${noRunsFirstInning} - ${yesRunsFirstInning}`;
    }

    getNoRunsFirstInningStreak({games}: RosterPlayer): string {
        let streak: number = 0;

        if (games === undefined || games.length === 0) {
            return `${streak}`;
        }

        const playerStatsWithLineScore: [PlayerStats, Sites<LineScore>][] = games
            .sort(PlayerStats.sortChronologically)
            .filter(PlayerStats.playerStarted)
            .map(PlayerStats.getStatsWithLineScore(this.gamesMap));

        function pitcherThrewNoRunsInFirstInning([{team}, {home, away}]: [PlayerStats, Sites<LineScore>]) {
            const teamAbbreviation: string = team;
            if (away.team === teamAbbreviation) {
                return home.scoresByInning['1'] === '0';
            } else if (home.team === teamAbbreviation) {
                return away.scoresByInning['1'] === '0';
            } else {
                throw new Error('Pitcher did not play for home team or away team');
            }
        }

        let playerStatsAndLineScore: [PlayerStats, Sites<LineScore>] | undefined = playerStatsWithLineScore.pop();

        if (playerStatsAndLineScore) {
            const firstResult: boolean = pitcherThrewNoRunsInFirstInning(playerStatsAndLineScore);
            while (playerStatsAndLineScore !== undefined && firstResult === pitcherThrewNoRunsInFirstInning(playerStatsAndLineScore)) {
                if (firstResult) {
                    streak++;
                } else {
                    --streak;
                }

                playerStatsAndLineScore = playerStatsWithLineScore.pop();
            }
        }

        return `${streak}`;
    }
}