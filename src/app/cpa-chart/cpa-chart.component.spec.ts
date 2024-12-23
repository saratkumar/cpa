import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpaChartComponent } from './cpa-chart.component';

describe('CpaChartComponent', () => {
  let component: CpaChartComponent;
  let fixture: ComponentFixture<CpaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpaChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
