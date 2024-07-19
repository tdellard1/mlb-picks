const {createClient} = require('redis');

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

module.exports.client = async () => redisClient;

module.exports.set = async (key, value) => {
  const client = await redisClient;
  return client.set(key, value);
}

module.exports.get = async (key) => {
  const client = await redisClient;
  return client.get(key);
}

module.exports.getList = async (key) => {
  const client = await redisClient;
  return client.lRange(key, 0, -1);
}

module.exports.listAddAll = async (key, array) => {
  const client = await redisClient;
  return client.lPush(key, array);
}

module.exports.has = async (key) => {
  const client = await redisClient;
  return client.exists(key);
}

module.exports.length = async (key) => {
  const client = await redisClient;
  return client.lLen(key);
}

module.exports.delete = async (key) => {
  const client = await redisClient;
  return client.del(key);
}
