import {Game} from "./game.interface";
import {Team} from "./team.interface";

export interface TeamSchedule {
  team: string,
  schedule: Game[],
  teamDetails?: Team,
}
