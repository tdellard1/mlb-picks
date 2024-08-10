import {NextFunction, Request, Response} from 'express';
import {RedisClient} from "../../clients/redis-client.js";
import {FirebaseClient} from "../../services/firebase.service.js";
import {Roster} from "../../models/players/rosters.model.js";

export function rostersController(firebase: FirebaseClient, redis: RedisClient) {
    const database: FirebaseClient = firebase;
    const cacheClient: RedisClient = redis;

    const fetchRostersForTeam = async (request: Request, response: Response, next: NextFunction) => {
        const teams: string[] = request.query['teams'] as string[];

        const rostersStringSet: string[] = await cacheClient.sMembers('rosters');
        const rosters: Roster[] = rostersStringSet.map((roster: string) => new Roster(JSON.parse(roster)));

        const teamRosters: Roster[] = teams.map((teamAbbreviation: string) => rosters.find(({team}) => team === teamAbbreviation)!);

        response.json(teamRosters);
    }

    return {
        fetchRostersForTeam
    }
}