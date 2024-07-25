import {createClient, RedisDefaultModules, RedisFunctions, RedisModules, RedisScripts} from 'redis';
import {ConvertArgumentType} from "@redis/client/dist/lib/commands";
import { RedisClientType } from '@redis/client/dist/lib/client';
import {firebaseFileKeys} from "./loadData.js";

const redisClient = createClient({
  password: 'f1DYQKVzeL9dVvFw9ULp1Sro5w59g4NK',
  socket: {
    host: 'redis-12887.c239.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 12887
  }
}).on('error', err => console.log('Redis Client Error', err))
  .on('end', () => console.log('Redis Client Ending'))
  .on('connect', () => {
    console.log('##########################################################');
    console.log('#####            REDIS STORE CONNECTED               #####');
    console.log('##########################################################\n');
  })
  .connect();

const dataAboutKeys: { [key: string]: MetaData } = {};

firebaseFileKeys.forEach((key: string) => {
  console.log('iterating through firebase Keys');
  dataAboutKeys[key] = {
    lastUpdated: new Date().setHours(0, 0, 0, 0)
  } as MetaData;
});

export function setLastUpdated(key: string, count: number) {
  dataAboutKeys[key] = {
    lastUpdated: Date.now(),
    count
  } as MetaData;
}

export const metaData = dataAboutKeys;

export declare type  Client = RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

export const client = async (): Promise<Client> => redisClient;

export const getList = async (key: string): Promise<ConvertArgumentType<any, any[]>> => {
  const client: Client = await redisClient;
  return client.lRange(key, 0, -1);
}

export const listAddAll = async (key: string, array: any[]): Promise<ConvertArgumentType<string, number>> => {
  const client: Client = await redisClient;
  return client.lPush(key, array);
}

export const has = async (key: string): Promise<ConvertArgumentType<string, number>> => {
  const client: Client = await redisClient;
  return client.exists(key);
}

export const length = async (key: string): Promise<ConvertArgumentType<string, number>> => {
  const client: Client = await redisClient;
  return client.lLen(key);
}

export const remove = async (key: string): Promise<ConvertArgumentType<string, number>> => {
  const client: Client = await redisClient;
  return client.del(key);
}

export interface MetaData {
  lastUpdated: number;
  count: number;
}
