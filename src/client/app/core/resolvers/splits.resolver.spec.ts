import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { splitsResolver } from './splits.resolver';

describe('splitsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => splitsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
