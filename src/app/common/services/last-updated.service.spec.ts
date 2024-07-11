import { TestBed } from '@angular/core/testing';

import { LastUpdatedService } from './last-updated.service';

describe('LastUpdatedService', () => {
  let service: LastUpdatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastUpdatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
