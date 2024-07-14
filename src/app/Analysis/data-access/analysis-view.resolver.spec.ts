import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { analysisViewResolver } from './analysis-view.resolver';

describe('analysisViewResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => analysisViewResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
