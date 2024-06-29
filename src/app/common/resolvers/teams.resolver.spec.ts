import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { teamsResolver } from './teams.resolver';

describe('teamsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => teamsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
