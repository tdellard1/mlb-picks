import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertPicksComponent } from './expert-picks.component';

describe('FormGeneralComponent', () => {
  let component: ExpertPicksComponent;
  let fixture: ComponentFixture<ExpertPicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpertPicksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpertPicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
