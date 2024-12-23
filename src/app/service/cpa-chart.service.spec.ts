import { TestBed } from '@angular/core/testing';

import { CpaChartService } from './cpa-chart.service';

describe('CpaChartService', () => {
  let service: CpaChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpaChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
