import {replaceInCache} from "../../services/cache.service.js";
import {uploadFile} from "../../services/firebase.service.js";
import {AxiosResponse} from "axios";
import {RosterPlayer} from "../../models/players/roster-player.model.js";
import {getPlayers} from "../../services/tank-01.service.js";

const key: string = 'players';

// Write-through Strategy
export async function updatePlayers(): Promise<RosterPlayer[]> {
    const players: RosterPlayer[] = await retrievePlayersFromTank01();
    if (players) {
        const lengthInCache: number = await replacePlayersInCache(players);

        if (lengthInCache > 0) {
            await addRosterPlayersToDatabase(players);
        }
    }

    return players;
}

export async function addRosterPlayersToDatabase(teams: RosterPlayer[]) {
    await uploadFile(key, teams);
}

export async function replacePlayersInCache(players: RosterPlayer[]): Promise<number> {
    const stringifyPlayers: string[] = players.map((roster: RosterPlayer) => JSON.stringify(roster, null, 0));
    return await replaceInCache(key, stringifyPlayers);
}

export async function retrievePlayersFromTank01(): Promise<RosterPlayer[]> {
    const {data}: AxiosResponse<RosterPlayer[]> = await getPlayers();
    return data;
}