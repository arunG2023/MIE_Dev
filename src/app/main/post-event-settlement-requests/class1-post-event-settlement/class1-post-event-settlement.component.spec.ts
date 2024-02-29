import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Class1PostEventSettlementComponent } from './class1-post-event-settlement.component';

describe('Class1PostEventSettlementComponent', () => {
  let component: Class1PostEventSettlementComponent;
  let fixture: ComponentFixture<Class1PostEventSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Class1PostEventSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Class1PostEventSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
