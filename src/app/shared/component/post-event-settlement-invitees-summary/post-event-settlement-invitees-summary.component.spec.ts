import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventSettlementInviteesSummaryComponent } from './post-event-settlement-invitees-summary.component';

describe('PostEventSettlementInviteesSummaryComponent', () => {
  let component: PostEventSettlementInviteesSummaryComponent;
  let fixture: ComponentFixture<PostEventSettlementInviteesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventSettlementInviteesSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventSettlementInviteesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
