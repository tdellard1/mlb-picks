import {NextFunction, Request, Response, Router} from 'express';
import {addToCache} from "../../services/cache.service.js";
import {getCachedPlayers, getPlayersFromDatabase, havePlayers} from "./players.service.js";
import {RosterPlayer} from "../../models/players/roster-player.model.js";

const key: string = 'players';
const router: Router = Router();

router.get(`/${key}`,
    async (_: Request, res: Response, next: NextFunction) => {
        const hasPlayers: boolean = await havePlayers();
        if (hasPlayers) {
            try {
                const result: RosterPlayer[] = await getCachedPlayers();

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
        const players: RosterPlayer[] = await getPlayersFromDatabase();
        response.json(players);
        await addToCache(key, players);
    });

export default router;
