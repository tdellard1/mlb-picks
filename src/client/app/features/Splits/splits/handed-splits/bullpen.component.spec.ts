import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BullpenComponent } from './bullpen.component';

describe('HandedSplitsComponent', () => {
  let component: BullpenComponent;
  let fixture: ComponentFixture<BullpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BullpenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BullpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
