import {ResolveFn} from '@angular/router';
import {Team, Teams} from "../model/team.interface";
import {firstValueFrom} from "rxjs";
import {liveQuery} from "dexie";
import {db} from "../../../../db";

export const teamsResolver: ResolveFn<Teams> = async (): Promise<Teams> => {
  const teams$: any = liveQuery<Team[]>(() => db.teams.toArray());
  const teamList: Team[] = await firstValueFrom(teams$);

  return new Teams(teamList);
};

