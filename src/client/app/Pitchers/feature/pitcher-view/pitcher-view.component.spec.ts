import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitcherViewComponent } from './pitcher-view.component';

describe('PitcherViewComponent', () => {
  let component: PitcherViewComponent;
  let fixture: ComponentFixture<PitcherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitcherViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitcherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
