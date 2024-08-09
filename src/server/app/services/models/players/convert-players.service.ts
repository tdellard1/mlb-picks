import {getFromCache, replaceInCache} from "../../cache.service.js";
import {RosterPlayer} from "../../../models/players/roster-player.model.js";
import {Roster} from "../../../models/players/rosters.model.js";
import {BoxScore} from "../../../models/boxScores/box-scores.model.js";
import {PlayersStats, PlayerStats} from "../../../models/boxScores/player-stats.model.js";

export async function convertPlayersRedisSets() {
    const rosters: Roster[] = await getFromCache('rosters', Roster, 'set');
    const rosterPlayers: RosterPlayer[] = rosters.map(({roster}) => roster).flat();
    const mRosterPlayers: Map<string, RosterPlayer> = new Map();
    const rosterPlayersLength: number = rosterPlayers.length;

    for (let i = 0; i < rosterPlayersLength; i++) {
        const rosterPlayer: RosterPlayer = rosterPlayers[i];
        mRosterPlayers.set(rosterPlayer.playerID, rosterPlayer);
    }


    const boxScores: BoxScore[] = await getFromCache('boxScores', BoxScore, 'set');
    const playerStats: PlayerStats[] = convertBoxScoresToListOfPlayerStats(boxScores);

    const leaguePlayers: RosterPlayer[] = await getFromCache('players', RosterPlayer, 'set');
    const numberOfPlayers: number = leaguePlayers.length;


    const allRosterPlayers: RosterPlayer[] = [];
    for (let i: number = 0; i < numberOfPlayers; i++) {
        let defaultPlayer: RosterPlayer = leaguePlayers[i];

        if (mRosterPlayers.has(defaultPlayer.playerID)) {
            defaultPlayer = mRosterPlayers.get(defaultPlayer.playerID)!;
        }

        const gameStats: PlayerStats[] = playerStats.filter(({playerID}) => playerID === defaultPlayer.playerID);

        if (gameStats.length > 0) {
            defaultPlayer.games = gameStats;
        }

        console.log('games: ', defaultPlayer.games?.length);

        allRosterPlayers.push(defaultPlayer);
    }

    console.log('All Roster Players: ', allRosterPlayers.length);
    console.log('All Roster Players With Stats: ', allRosterPlayers.filter(({games}) => !!games).length);

    const allRosterPlayersLength: number = allRosterPlayers.length;
    const replaceInCacheRequests: Promise<number>[] = [];


    for (let i: number = 0; i < allRosterPlayersLength; i++) {
        const player: RosterPlayer = allRosterPlayers[i];
        replaceInCacheRequests.push(replaceInCache(`player:${player.playerID}`, JSON.stringify(player)));
    }


    const results: number[] = await Promise.all(replaceInCacheRequests);
    console.log('results: ', new Set(results));
}

function convertBoxScoresToListOfPlayerStats(boxScores: BoxScore[]): PlayerStats[] {
    const playerStats: PlayerStats[] = [];
    const arrayLength: number = boxScores.length;

    for (let i: number = 0; i < arrayLength; i++) {
        const playerStatsFromBoxScores: PlayersStats | undefined = boxScores[i].playerStats;
        if (playerStatsFromBoxScores) {
            const playerStatsList: PlayerStats[] = Object.values(playerStatsFromBoxScores);
            const playerStatsLength: number = playerStatsList.length;

            for (let i: number = 0; i < playerStatsLength; i++) {
                playerStats.push(playerStatsList[i]);
            }
        }
    }

    return playerStats;
}