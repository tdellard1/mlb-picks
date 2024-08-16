import {PlayerStats} from "../interfaces/player-stats";
import {Tank01Date} from "./date.utils";

export function sortByGameDate() {
  return (a: PlayerStats, b: PlayerStats) => {
    const aDateObject: Tank01Date = new Tank01Date(a.gameID.slice(0, 8));
    const bDateObject: Tank01Date = new Tank01Date(b.gameID.slice(0, 8));

    return aDateObject.timeStamp - bDateObject.timeStamp;
  };
}
