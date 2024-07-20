import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { dailyScheduleResolver } from './daily-schedule.resolver';
import {Game} from "../../model/game.interface";

describe('dailyScheduleResolver', () => {
  const executeResolver: ResolveFn<Game[]> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => dailyScheduleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
