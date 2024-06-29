import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicksFormComponent } from './picks-form.component';

describe('PicksFormComponent', () => {
  let component: PicksFormComponent;
  let fixture: ComponentFixture<PicksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicksFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
