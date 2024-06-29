import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { picksResolver } from './picks.resolver';

describe('picksResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => picksResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
