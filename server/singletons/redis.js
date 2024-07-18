const {createClient} = require('redis');

const redisClient = createClient({
  password: 'f1DYQKVzeL9dVvFw9ULp1Sro5w59g4NK',
  socket: {
    host: 'redis-12887.c239.us-east-1-2.ec2.redns.redis-cloud.com',
    port: 12887
  }
}).on('error', err => console.log('Redis Client Error', err))
  .on('connect', () => {
    console.log('##########################################################');
    console.log('#####            REDIS STORE CONNECTED               #####');
    console.log('##########################################################\n');
  })
  .connect();



module.exports.set = async (key, value) => {
  const client = await redisClient;
  return client.set(key, value);
}

module.exports.get = async (key) => {
  const client = await redisClient;
  return client.get(key);
}
