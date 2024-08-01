import {NextFunction, Request, Response, Router} from 'express';
import {
    addRostersToCache,
    hasCachedRosters,
    retrieveRostersFromCache,
    retrieveRostersFromDatabase
} from "./rosters.service.js";
import {Roster} from "../../models/players/rosters.model.js";

const router: Router = Router();

router.get('/rosters',
    async (_: Request, res: Response, next: NextFunction) => {
        const hasRosters: boolean = await hasCachedRosters();
        if (hasRosters) {
            try {
                const result: Roster[] = await retrieveRostersFromCache();

                if (result.length > 0) {
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
    // Refactor Logic
    async (_: Request, response: Response): Promise<void> => {
        const rosters: Roster[] = await retrieveRostersFromDatabase();
        response.json(rosters);
        await addRostersToCache(rosters);
    });

export default router;
