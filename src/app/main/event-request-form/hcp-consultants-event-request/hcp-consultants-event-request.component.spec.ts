import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpConsultantsEventRequestComponent } from './hcp-consultants-event-request.component';

describe('HcpConsultantsEventRequestComponent', () => {
  let component: HcpConsultantsEventRequestComponent;
  let fixture: ComponentFixture<HcpConsultantsEventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcpConsultantsEventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcpConsultantsEventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
