import {BoxScore} from "../model/box.score.model";
import {Sites} from "./sites";
import {LineScore} from "./line-score";
import {Starter} from "./starter";

export interface Game {
  gameID: string;
  gameType: string;
  away: string;
  gameTime: string;
  teamIDHome: string;
  gameDate: string;
  gameStatus?: string;
  gameTime_epoch: string;
  teamIDAway: string;
  probableStartingLineups: Sites<Starter[]>;
  probableStartingPitchers: Sites<string>;
  home: string;
  lineScore?: Sites<LineScore>;
  boxScore?: BoxScore;
}
