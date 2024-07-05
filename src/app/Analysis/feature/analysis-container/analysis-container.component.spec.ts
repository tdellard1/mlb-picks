import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisContainerComponent } from './analysis-container.component';

describe('AnalysisComponent', () => {
  let component: AnalysisContainerComponent;
  let fixture: ComponentFixture<AnalysisContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
