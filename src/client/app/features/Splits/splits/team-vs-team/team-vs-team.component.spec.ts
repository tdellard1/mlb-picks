import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamVsTeamComponent } from './team-vs-team.component';

describe('TeamVsTeamComponent', () => {
  let component: TeamVsTeamComponent;
  let fixture: ComponentFixture<TeamVsTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamVsTeamComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamVsTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
