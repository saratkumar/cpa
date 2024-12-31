import { TestBed } from '@angular/core/testing';

import { CpaApiService } from './cpa-api.service';

describe('CpaApiService', () => {
  let service: CpaApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpaApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
