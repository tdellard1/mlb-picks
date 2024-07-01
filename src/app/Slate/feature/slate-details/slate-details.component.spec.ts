import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlateDetailsComponent } from './slate-details.component';

describe('SlateDetailsComponent', () => {
  let component: SlateDetailsComponent;
  let fixture: ComponentFixture<SlateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlateDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
