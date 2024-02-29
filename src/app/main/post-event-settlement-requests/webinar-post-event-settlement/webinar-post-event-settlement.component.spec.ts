import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarPostEventSettlementComponent } from './webinar-post-event-settlement.component';

describe('WebinarPostEventSettlementComponent', () => {
  let component: WebinarPostEventSettlementComponent;
  let fixture: ComponentFixture<WebinarPostEventSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinarPostEventSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarPostEventSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
