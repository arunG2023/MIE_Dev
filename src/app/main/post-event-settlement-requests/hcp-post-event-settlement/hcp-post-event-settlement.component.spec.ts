import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpPostEventSettlementComponent } from './hcp-post-event-settlement.component';

describe('HcpPostEventSettlementComponent', () => {
  let component: HcpPostEventSettlementComponent;
  let fixture: ComponentFixture<HcpPostEventSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcpPostEventSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcpPostEventSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
