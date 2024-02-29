import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventSettlementExpenseSummaryComponent } from './post-event-settlement-expense-summary.component';

describe('PostEventSettlementExpenseSummaryComponent', () => {
  let component: PostEventSettlementExpenseSummaryComponent;
  let fixture: ComponentFixture<PostEventSettlementExpenseSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventSettlementExpenseSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventSettlementExpenseSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
