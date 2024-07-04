import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisGameSelectorComponent } from './analysis-game-selector.component';

describe('AnalysisGameSelectorComponent', () => {
  let component: AnalysisGameSelectorComponent;
  let fixture: ComponentFixture<AnalysisGameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisGameSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisGameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
