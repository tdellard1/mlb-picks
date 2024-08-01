import {NextFunction, Request, Response, Router} from 'express';
import {addToCache} from "../../services/cache.service.js";
import {BoxScore} from "../../models/boxScores/box-scores.model.js";
import {getBoxScores, getCachedBoxScores, haveBoxScores} from "./box-score.service.js";

const key: string = 'boxScores';
const router: Router = Router();

router.get('/boxScores',
    async (_: Request, res: Response, next: NextFunction) => {
        const hasBoxScores: boolean = await haveBoxScores();
        if (hasBoxScores) {
            try {
                const result: BoxScore[] = await getCachedBoxScores();

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
        const boxScores: BoxScore[] = await getBoxScores();
        response.json(boxScores);
        await addToCache(key, boxScores);
    });

export default router;