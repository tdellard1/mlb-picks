import {RosterPlayer} from "../models/players/roster-player.model.js";
import {PlayerStats} from "../models/boxScores/player-stats.model.js";
import {Schedule} from "../models/schedules/schedule.model.js";
import {Game} from "../models/schedules/games/game.model.js";
import {LineScore, Teams} from "../models/schedules/games/starting-lineups.model.js";

export class PitcherUtils {
    gamesMap: Map<string, Game> = new Map();

    constructor(schedules: Schedule[]) {
        const allGames: Game[] = schedules.map(({schedule}: Schedule) => schedule).flat();
        const gamesWithLineScores: Game[] = allGames.filter(({lineScore}) => !!lineScore);
        const gamesLength: number = gamesWithLineScores.length;
        for (let i: number = 0; i < gamesLength; i++) {
            const game: Game = gamesWithLineScores[i];
            this.gamesMap.set(game.gameID, game);
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
                const {lineScore}: Game = this.gamesMap.get(gameID)!;

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

        const playerStatsWithLineScore: [PlayerStats, Teams<LineScore>][] = games
            .sort((a, b) => {
                const aGameFormattedDate: string = a.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
                const aGameDate: Date = new Date(aGameFormattedDate);

                const bGameFormattedDate: string = b.gameID.split('_')[0].replace(/(\d{4})(\d{2})(\d{2})/g, '$1/$2/$3');
                const bGameDate: Date = new Date(bGameFormattedDate);

                return aGameDate.getTime() - bGameDate.getTime();
            })
            .filter((playerStats: PlayerStats) => playerStats.started === 'True')
            .map((playerStats: PlayerStats) => {
                return [playerStats, this.gamesMap.get(playerStats.gameID)!.lineScore];
            });

        function pitcherThrewNoRunsInFirstInning([playerStats, lineScore]: [PlayerStats, Teams<LineScore>]) {
            const teamAbbreviation: string = playerStats.team;
            if (lineScore.away.team === teamAbbreviation) {
                return lineScore.home.scoresByInning['1'] === '0';
            } else if (lineScore.home.team === teamAbbreviation) {
                return lineScore.away.scoresByInning['1'] === '0';
            } else {
                throw new Error('Pitcher did not play for home team or away team');
            }
        }

        let playerStatsAndLineScore: [PlayerStats, Teams<LineScore>] | undefined = playerStatsWithLineScore.pop();

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