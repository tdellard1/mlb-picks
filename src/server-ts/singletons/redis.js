import {createClient} from 'redis';

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

export const client = async () => redisClient;

export const set = async (key, value) => {
  const client = await redisClient;
  return client.set(key, value);
}

export const get = async (key) => {
  const client = await redisClient;
  return client.get(key);
}

export const getList = async (key) => {
  const client = await redisClient;
  return client.lRange(key, 0, -1);
}

export const listAddAll = async (key, array) => {
  const client = await redisClient;
  return client.lPush(key, array);
}

export const has = async (key) => {
  const client = await redisClient;
  return client.exists(key);
}

export const length = async (key) => {
  const client = await redisClient;
  return client.lLen(key);
}

export const remove = async (key) => {
  const client = await redisClient;
  return client.del(key);
}
