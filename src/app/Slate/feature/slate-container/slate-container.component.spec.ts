import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlateContainerComponent } from './slate-container.component';

describe('SlateContainerComponent', () => {
  let component: SlateContainerComponent;
  let fixture: ComponentFixture<SlateContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlateContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlateContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
