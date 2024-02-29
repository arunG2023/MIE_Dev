import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonarariumPaymentComponent } from './honararium-payment.component';

describe('HonarariumPaymentComponent', () => {
  let component: HonarariumPaymentComponent;
  let fixture: ComponentFixture<HonarariumPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonarariumPaymentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonarariumPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
