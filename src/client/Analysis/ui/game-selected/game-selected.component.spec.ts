import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectedComponent } from './game-selected.component';

describe('GameSelectedInfoComponent', () => {
  let component: GameSelectedComponent;
  let fixture: ComponentFixture<GameSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
