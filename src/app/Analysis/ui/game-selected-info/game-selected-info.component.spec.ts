import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectedInfoComponent } from './game-selected-info.component';

describe('GameSelectedInfoComponent', () => {
  let component: GameSelectedInfoComponent;
  let fixture: ComponentFixture<GameSelectedInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSelectedInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSelectedInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
