import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { boxScoreGuard } from './boxScoreGuard';

describe('dataGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => boxScoreGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
