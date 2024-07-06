const express = require("express");
const router = express.Router();
const teams = require("./teams");
const slates = require("./slates");
const players = require("./players");
const boxScores = require("./boxScores");
const schedules = require("./schedules");

router.use("/teams", teams);
router.use("/slates", slates);
router.use("/players", players);
router.use("/boxScores", boxScores);
router.use("/schedules", schedules);

module.exports = router;
