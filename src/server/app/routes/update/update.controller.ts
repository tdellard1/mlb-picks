import {RedisClient} from "../../clients/redis-client.js";
import {NextFunction, Request, Response} from "express";
import {addClient, getClientNames, getClientUpdateStatus, updateClient} from "./update.service.js";

export default function updateController(redis: RedisClient) {
    const cache: RedisClient = redis;

    async function needToUpdate(request: Request, response: Response, next: NextFunction) {
        const clientName: string = (request.headers['x-forwarded-for'] as string || request.socket.remoteAddress || '').split(',')[0].trim();

        const clientNames: string[] = await getClientNames();
        const hasClient: boolean = clientNames.includes(clientName);

        if (hasClient) {
            const updateStatus: boolean = await getClientUpdateStatus(clientName);

            if (updateStatus) {
                await updateClient(clientName, !updateStatus);
            }

            response.json(updateStatus);
        } else {
            await addClient(clientName);
            response.json(true);
        }
    }

    return {
        needToUpdate
    }
}