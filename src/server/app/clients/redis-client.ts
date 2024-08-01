import {createClient, RedisClientType, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts} from 'redis';
import * as dotenv from "dotenv";

dotenv.config();

const {REDIS_PASS, REDIS_HOST}: NodeJS.ProcessEnv = process.env;

if (!REDIS_PASS || !REDIS_HOST) {
    console.error(
        "No REDIS_PASS or REDIS_HOST environment variable has been defined in config.env"
    );
    process.exit(1);
}
export declare type RedisClient = RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

const redisClient: RedisClient =
    await createClient({
        password: REDIS_PASS,
        socket: {
            host: REDIS_HOST,
            port: 12887
        }
    })
        .on('error', err => console.log('Redis Client Error', err))
        .on('end', () => console.log('Redis Client Ending'))
        .on('connect', () => {
            console.log('##########################################################');
            console.log('#####            REDIS STORE CONNECTED               #####');
            console.log('##########################################################\n');
        })
        .connect();

export function getClient(): RedisClient {
    return redisClient;
}