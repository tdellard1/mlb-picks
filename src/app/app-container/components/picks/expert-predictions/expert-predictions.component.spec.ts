import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertPredictionsComponent } from './expert-predictions.component';

describe('ExpertPredictionsComponent', () => {
  let component: ExpertPredictionsComponent;
  let fixture: ComponentFixture<ExpertPredictionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertPredictionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertPredictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
