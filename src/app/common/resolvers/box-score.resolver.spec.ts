import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { boxScoresResolver } from './box-scores.resolver';

describe('boxScoreResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
      TestBed.runInInjectionContext(() => boxScoresResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
