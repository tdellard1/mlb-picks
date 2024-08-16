import {RedisClient} from "../../clients/redis-client.js";
import {NextFunction, Request, Response} from "express";
import {addClient, getClientNames, getClientUpdateStatus} from "./update.service.js";

export default function updateController(redis: RedisClient) {
    const cache: RedisClient = redis;

    async function needToUpdate(request: Request, response: Response, next: NextFunction) {
        const key: string = 'clients';
        const ip: string = (request.headers['x-forwarded-for'] as string || request.socket.remoteAddress || '').split(',')[0].trim();

        const exists: boolean = await cache.exists(key) !== 0;

        if (exists) {
            const updateStatus: boolean = await getUpdateStatus(ip);
            response.json(updateStatus);
        } else {
            await addClient(ip);
            response.json(true);
        }

    }

    async function getUpdateStatus(ip: string): Promise<boolean> {
        const clientNames: string[] = await getClientNames();
        const hasClient: boolean = clientNames.includes(ip);

        if (hasClient) {
            return await getClientUpdateStatus(ip);
        } else {
            await addClient(ip);
            return true;
        }
    }

    return {
        needToUpdate
    }
}