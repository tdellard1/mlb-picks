import {NextFunction, Request, Response, Router} from 'express';
import {addToCache} from "../../services/cache.service.js";
import {haveSchedules, retrieveSchedulesFromCache, retrieveSchedulesFromDatabase} from "./schedules.service.js";
import {Schedule} from "../../models/schedules/schedule.model.js";

const key: string = 'schedules';
const router: Router = Router();

router.get(`/${key}`,
    async (_: Request, res: Response, next: NextFunction) => {
        const hasPlayers: boolean = await haveSchedules();
        if (hasPlayers) {
            try {
                const result: Schedule[] = await retrieveSchedulesFromCache();

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
    async (_: Request, response: Response): Promise<void> => {
        const schedules: Schedule[] = await retrieveSchedulesFromDatabase();
        await addToCache(key, schedules.map(schedule => JSON.stringify(schedule)));
        response.json(schedules);
    });

export default router;
