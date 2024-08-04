import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import firebaseClient, {FirebaseClient} from "../../services/firebase.service.js";
import {boxScoreController} from "./box-scores.controller.js";

export default function boxScoreRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();
    const firebase: FirebaseClient = firebaseClient();

    const controller: any = boxScoreController(firebase, client);

    router
        .route('/')
        .get(controller.fetchAllBoxScoresFromCache,
            controller.fetchAllBoxScoresFromDatabase)

    return router
}