import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalUtilityPostEventSettlementComponent } from './medical-utility-post-event-settlement.component';

describe('MedicalUtilityPostEventSettlementComponent', () => {
  let component: MedicalUtilityPostEventSettlementComponent;
  let fixture: ComponentFixture<MedicalUtilityPostEventSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalUtilityPostEventSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalUtilityPostEventSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
