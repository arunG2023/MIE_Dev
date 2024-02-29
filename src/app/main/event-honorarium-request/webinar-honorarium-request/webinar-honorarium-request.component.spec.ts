import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarHonorariumRequestComponent } from './webinar-honorarium-request.component';

describe('WebinarHonorariumRequestComponent', () => {
  let component: WebinarHonorariumRequestComponent;
  let fixture: ComponentFixture<WebinarHonorariumRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinarHonorariumRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarHonorariumRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
