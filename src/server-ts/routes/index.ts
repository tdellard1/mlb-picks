import express  from "express";
import teams from "./teams/index.js";
import slates from "./slates/index.js";
import players from "./players/index.js";
import boxScores from "./boxScores/index.js";
import rosters from "./rosters/index.js";
import schedules from "./schedules/index.js";
import game from "./game/index.js";

const router = express.Router();

router.use("/teams", teams);
router.use("/slates", slates);
router.use("/players", players);
router.use("/boxScores", boxScores);
router.use("/rosters", rosters);
router.use("/schedules", schedules);
router.use("/game", game);

export default router;
