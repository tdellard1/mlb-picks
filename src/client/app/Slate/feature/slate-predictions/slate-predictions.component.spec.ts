import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlatePredictionsComponent } from './slate-predictions.component';

describe('SlatePredictionsComponent', () => {
  let component: SlatePredictionsComponent;
  let fixture: ComponentFixture<SlatePredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlatePredictionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlatePredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
