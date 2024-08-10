import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import firebaseClient, {FirebaseClient} from "../../services/firebase.service.js";
import {rostersController} from "./rosters.controller.js";

export default function rosterRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();
    const firebase: FirebaseClient = firebaseClient();

    const controller: any = rostersController(firebase, client);

    router
        .route('/teams')
        .get(controller.fetchRostersForTeam)

    return router
}