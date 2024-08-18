import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandedSplitsComponent } from './handed-splits.component';

describe('HandedSplitsComponent', () => {
  let component: HandedSplitsComponent;
  let fixture: ComponentFixture<HandedSplitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandedSplitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HandedSplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
