import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceTreasuryComponent } from './finance-treasury.component';

describe('FinanceTreasuryComponent', () => {
  let component: FinanceTreasuryComponent;
  let fixture: ComponentFixture<FinanceTreasuryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceTreasuryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceTreasuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
