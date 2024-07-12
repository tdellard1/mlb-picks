import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchUpsComponent } from './match-ups.component';

describe('MatchUpsComponent', () => {
  let component: MatchUpsComponent;
  let fixture: ComponentFixture<MatchUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchUpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
