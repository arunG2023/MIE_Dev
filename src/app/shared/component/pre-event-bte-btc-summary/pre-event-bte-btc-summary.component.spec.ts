import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEventBteBtcSummaryComponent } from './pre-event-bte-btc-summary.component';

describe('PreEventBteBtcSummaryComponent', () => {
  let component: PreEventBteBtcSummaryComponent;
  let fixture: ComponentFixture<PreEventBteBtcSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreEventBteBtcSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEventBteBtcSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
