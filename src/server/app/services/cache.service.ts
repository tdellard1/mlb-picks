import {getClient, RedisClient} from "../clients/redis-client.js";

export async function getFromCache<T>(key: string, type: { new(parse: any): T; }, dataType: string): Promise<T[]> {
    const client: RedisClient = getClient();

    try {
        let cacheResults: string[] = [];
        switch (dataType) {
            case 'set':
                cacheResults = await client.sMembers(key);
                break;
            case 'list':
                cacheResults = await client.lRange(key, 0, -1);
                break;
            default:
                break;
        }

        if (cacheResults.length > 0) {
            return cacheResults.map((result: string) => new type(JSON.parse(result)));
        }
    } catch (error) {
        console.error(error);
    }

    return [];
}

export async function addToCache(key: string, data: string | string[]): Promise<number> {
    const client: RedisClient = getClient();

    try {
        return await client.sAdd(key, data);
    } catch (error) {
        return 0;
    }
}

export async function replaceInCache(key: string, data: string | string[]): Promise<number> {
    const client: RedisClient = getClient();
    let result: number;

    try {
        const length: number = await client.exists(key);
        if (length > 0) {
            await client.del(key);
        }
        try {
            result = await client.sAdd(key, data);
        } catch (err) {
            console.log('err: ', err);
            result = 0;
        }

        return result;
    } catch (error) {
        return 0;
    }
}

export async function exists(key: string): Promise<number> {
    const client: RedisClient = getClient();
    return await client.exists(key);
}