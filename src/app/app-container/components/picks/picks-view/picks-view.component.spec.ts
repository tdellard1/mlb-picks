import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicksViewComponent } from './picks-view.component';

describe('PicksViewComponent', () => {
  let component: PicksViewComponent;
  let fixture: ComponentFixture<PicksViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PicksViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PicksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
