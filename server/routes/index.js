const express = require("express");
const router = express.Router();
const teams = require("./teams");
const slates = require("./slates");
const players = require("./players");
const boxScores = require("./boxScores");
const rosters = require("./rosters");
const schedules = require("./schedules");
const game = require("./game");
const {createClient} = require("redis");

router.use("/teams", cacheData, teams);
router.use("/slates", cacheData, slates);
router.use("/players", cacheData, players);
router.use("/boxScores", cacheData, boxScores);
router.use("/rosters", cacheData, rosters);
router.use("/schedules", cacheData, schedules);
router.use("/game", cacheData, game);

module.exports = router;

async function cacheData(req, res, next) {
  const client = await createClient({
    password: 'f1DYQKVzeL9dVvFw9ULp1Sro5w59g4NK',
    socket: {
      host: 'redis-12887.c239.us-east-1-2.ec2.redns.redis-cloud.com',
      port: 12887
    }
  }).on('error', err => console.log('Redis Client Error', err)).connect();

  const pathSegments = req.originalUrl.split('/');

  const requestedObject = pathSegments[2];
  let results;
  try {
    const cacheResults = await client.get(requestedObject);
    if (cacheResults) {
      results = JSON.parse(cacheResults);
      res.send(results);
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
}
