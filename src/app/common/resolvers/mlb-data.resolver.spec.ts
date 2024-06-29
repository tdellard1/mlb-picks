import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { scheduleResolver } from './schedule.resolver';

describe('mlbDataResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => scheduleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
