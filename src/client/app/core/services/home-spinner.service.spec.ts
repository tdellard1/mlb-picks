import { TestBed } from '@angular/core/testing';

import { HomeSpinnerService } from './home-spinner.service';

describe('HomeSpinnerService', () => {
  let service: HomeSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
