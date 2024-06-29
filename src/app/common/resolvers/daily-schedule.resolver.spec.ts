import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { dailyScheduleResolver } from './daily-schedule.resolver';

describe('dailyScheduleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => dailyScheduleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
