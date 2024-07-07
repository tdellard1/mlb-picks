import { TestBed } from '@angular/core/testing';

import { GameSelectorService } from './game-selector.service';

describe('GameSelecterService', () => {
  let service: GameSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
