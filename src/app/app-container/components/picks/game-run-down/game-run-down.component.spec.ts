import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRunDownComponent } from './game-run-down.component';

describe('GameRunDownComponent', () => {
  let component: GameRunDownComponent;
  let fixture: ComponentFixture<GameRunDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRunDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameRunDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
