import { TestBed } from '@angular/core/testing';

import { CpaChartSvgService } from './cpa-chart-svg.service';

describe('CpaChartSvgService', () => {
  let service: CpaChartSvgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CpaChartSvgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
