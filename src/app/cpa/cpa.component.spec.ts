import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpaComponent } from './cpa.component';

describe('CpaComponent', () => {
  let component: CpaComponent;
  let fixture: ComponentFixture<CpaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CpaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
