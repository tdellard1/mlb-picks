import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { schedulesResolver } from './schedules.resolver';

describe('schedulesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => schedulesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
