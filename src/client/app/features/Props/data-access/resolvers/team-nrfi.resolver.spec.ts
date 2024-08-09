import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { teamNrfiResolver } from './team-nrfi.resolver';

describe('teamNrfiResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => teamNrfiResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
