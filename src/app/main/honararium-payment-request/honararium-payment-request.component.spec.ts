import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonarariumPaymentRequestComponent } from './honararium-payment-request.component';

describe('HonarariumPaymentRequestComponent', () => {
  let component: HonarariumPaymentRequestComponent;
  let fixture: ComponentFixture<HonarariumPaymentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonarariumPaymentRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonarariumPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
