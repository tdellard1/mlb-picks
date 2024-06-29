import {Game} from "../model/game.interface";
import {getDateObject} from "./date.utils";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class AnalysisUtils {
  constructor() {}

  static doSomething(val: string) { return val; }
  static doSomethingElse(val: string) { return val; }

  gamesBeforeToday(game: Game): boolean {
    // TODO: Check for required fields, if one doesn't show up, request for it. Currently lineScore doesn't show up
    //  for game '20240616_TB@ATL' in team schedule endpoint/data, but does show up for box scores endpoint. Desired
    //  outcome is to send request to retrieve the correct data, save it to state replacing the line scores for the
    //  games for both teams schedules, then re-trigger the whole process again.
    //
    //  For Now: Just getting last 15 games that do have line score
    const beginningOfToday: number = new Date().setHours(0, 0, 0, 0);
    const dateOfGame: number = getDateObject(game.gameDate).getTime();

    return dateOfGame < beginningOfToday && !!game.lineScore;
  }
}
