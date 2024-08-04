import {NextFunction, Request, Response, Router} from 'express';
import {addToCache} from "../../services/cache.service.js";
import {hasCachedTeams, retrieveTeamsFromCache, retrieveTeamsFromDatabase} from "./teams.service.js";
import {Team} from "../../models/teams/teams.model.js";

const key: string = 'teams';
const router: Router = Router();

router.get(`/${key}`,
    async (_: Request, res: Response, next: NextFunction) => {
        const hasPlayers: boolean = await hasCachedTeams();
        if (hasPlayers) {
            try {
                const result: Team[] = await retrieveTeamsFromCache();

                if (result.length > 0) {
                    console.log(key, result);
                    res.json(result);
                } else {
                    next();
                }
            } catch (error) {
                next(error);
            }
        } else {
            next();
        }
    },
    async (_: Request, response: Response): Promise<void> => {
        const teams: Team[] = await retrieveTeamsFromDatabase();
        response.json(teams);
        await addToCache(key, teams);
    });

export default router;
