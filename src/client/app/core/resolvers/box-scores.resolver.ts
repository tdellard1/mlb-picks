import { ResolveFn } from '@angular/router';
import {db} from "../db";
import {BoxScore} from "../../common/model/box.score.model";

export const boxScoresResolver: ResolveFn<BoxScore[]> = () => {
  return db.boxScores.toArray();
};
