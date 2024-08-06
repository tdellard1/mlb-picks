import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import {PlayersController, playersController} from "./players.controller.js";

export default function playersRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();

    const controller: PlayersController = playersController(client);

    router
        .route('/')
        .get(controller.fetchPlayersFromCache);

    router
        .route('/pitchers')
        .get(controller.getPitcherStats);

    router
        .route('/:playerId')
        .get(controller.fetchPlayerFromCache);

    return router
}