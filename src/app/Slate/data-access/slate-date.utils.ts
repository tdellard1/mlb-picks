import {SlateDateDetails} from "./model/slate-date-details.model";
import {Slate} from "../../common/resolvers/picks.resolver";

export function getSlateDates(slate: Slate) {
  const yyyyMMddList: string[] = Array.from(slate.dates.keys());

  return yyyyMMddList.map((date) => new SlateDateDetails(date))
}
