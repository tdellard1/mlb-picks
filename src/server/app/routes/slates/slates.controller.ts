import {FirebaseClient} from "../../services/firebase.service.js";
import {RedisClient} from "../../clients/redis-client.js";
import {NextFunction, Request, Response} from "express";
import {Slate, Slates} from "../../models/slates/slate.model.js";

export default function slatesController(firebase: FirebaseClient, redis: RedisClient) {
    const cache: RedisClient = redis;
    const database: FirebaseClient = firebase;

    const fetchSlatesFromCache = async (): Promise<Slates> => {
        const teamStringSet: string[] = await cache.lRange('slates', 0, -1);
        return teamStringSet.map((teamString) => new Slate(JSON.parse(teamString)));
    }

    const updateSlatesInCache = async (slates: Slates): Promise<any> => {
    }

    const updateSlatesInDatabase = async (slates: Slates): Promise<any> => {
        return await database.uploadFile('slates', JSON.stringify(slates, null, 2));
    }

    async function getSlates(request: Request, response: Response, next: NextFunction) {
        const slates: Slates = await fetchSlatesFromCache();
        response.json(slates)
    }

    async function updateSlates(request: Request, response: Response, next: NextFunction) {
        const slates: Slates = request.body;
        const results = await updateSlatesInDatabase(slates);

        response.json(results);
    }

    return {
        getSlates,
        updateSlates
    }
}