import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlateFormComponent } from './slate-form.component';

describe('SlateFormComponent', () => {
  let component: SlateFormComponent;
  let fixture: ComponentFixture<SlateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
