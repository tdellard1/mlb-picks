const express = require("express");
const router = express.Router();
const teams = require("./teams");
const slates = require("./slates");
const players = require("./players");
const boxScores = require("./boxScores");
const rosters = require("./rosters");
const schedules = require("./schedules");
const game = require("./game");

router.use("/teams", teams);
router.use("/slates", slates);
router.use("/players", players);
router.use("/boxScores", boxScores);
router.use("/rosters", rosters);
router.use("/schedules", schedules);
router.use("/game", game);

module.exports = router;
