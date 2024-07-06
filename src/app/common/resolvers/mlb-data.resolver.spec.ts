import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import {mlbSchedulesResolver} from "./mlb-schedules.resolver";
import 'jasmine'
import {MLBTeamSchedule} from "../../Analysis/data-access/mlb-team-schedule.model";


describe('mlbDataResolver', () => {
  const executeResolver: ResolveFn<MLBTeamSchedule[]> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => mlbSchedulesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
