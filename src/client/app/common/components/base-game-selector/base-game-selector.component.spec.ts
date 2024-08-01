import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseGameSelectorComponent } from './base-game-selector.component';

describe('BaseGameSelectorComponent', () => {
  let component: BaseGameSelectorComponent;
  let fixture: ComponentFixture<BaseGameSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseGameSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseGameSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
