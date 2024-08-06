import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import firebaseClient, {FirebaseClient} from "../../services/firebase.service.js";
import teamsController from "./teams.controller.js";

export default function teamsRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();
    const firebase: FirebaseClient = firebaseClient();

    const controller: any = teamsController(firebase, client);

    router
        .route('/')
        .get(controller.getTeams)

    router
        .route('/nrfi')
        .get(controller.getTeamsNRFIPercentage)

    return router
}