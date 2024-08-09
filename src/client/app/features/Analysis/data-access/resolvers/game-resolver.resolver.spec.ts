import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { gameResolverResolver } from './game-resolver.resolver';

describe('gameResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => gameResolverResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
