import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitcherVsPitcherComponent } from './pitcher-vs-pitcher.component';

describe('PitcherVsPitcherComponent', () => {
  let component: PitcherVsPitcherComponent;
  let fixture: ComponentFixture<PitcherVsPitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitcherVsPitcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitcherVsPitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
