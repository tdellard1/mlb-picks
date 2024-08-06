import {Router} from "express";
import {getClient, RedisClient} from "../../clients/redis-client.js";
import firebaseClient, {FirebaseClient} from "../../services/firebase.service.js";
import slatesController from "./slates.controller.js";

export default function slatesRouter(): Router {
    const router: Router = Router();
    const client: RedisClient = getClient();
    const firebase: FirebaseClient = firebaseClient();

    const controller: any = slatesController(firebase, client);

    router
        .route('/')
        .get(controller.getSlates)

    router
        .route('/')
        .post(controller.updateSlates)


    return router
}