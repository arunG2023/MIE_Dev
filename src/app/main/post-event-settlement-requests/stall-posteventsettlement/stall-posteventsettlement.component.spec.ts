import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallPosteventsettlementComponent } from './stall-posteventsettlement.component';

describe('StallPosteventsettlementComponent', () => {
  let component: StallPosteventsettlementComponent;
  let fixture: ComponentFixture<StallPosteventsettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallPosteventsettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallPosteventsettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
