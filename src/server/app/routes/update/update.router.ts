import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import updateController from "./update.controller.js";

export default function updateRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();

    const controller: any = updateController(client);

    router
        .route('/')
        .get(controller.needToUpdate);

    return router
}