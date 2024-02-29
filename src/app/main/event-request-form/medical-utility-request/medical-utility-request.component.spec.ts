import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalUtilityRequestComponent } from './medical-utility-request.component';

describe('MedicalUtilityRequestComponent', () => {
  let component: MedicalUtilityRequestComponent;
  let fixture: ComponentFixture<MedicalUtilityRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedicalUtilityRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicalUtilityRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
