import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchersContainerComponent } from './pitchers-container.component';

describe('PitchersContainerComponent', () => {
  let component: PitchersContainerComponent;
  let fixture: ComponentFixture<PitchersContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchersContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchersContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
