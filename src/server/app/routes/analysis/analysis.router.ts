import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import analysisController from "./analysis.controller.js";
export default function analysisRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();

    const controller: any = analysisController(client);

    router
        .route('/:gameID')
        .get(controller.getAnalysisForGame)

    return router
}