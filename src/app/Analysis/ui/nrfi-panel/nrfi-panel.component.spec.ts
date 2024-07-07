import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NrfiPanelComponent } from './nrfi-panel.component';

describe('NrfiPanelComponent', () => {
  let component: NrfiPanelComponent;
  let fixture: ComponentFixture<NrfiPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NrfiPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NrfiPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
