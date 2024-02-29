import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarEventRequestComponent } from './webinar-event-request.component';

describe('WebinarEventRequestComponent', () => {
  let component: WebinarEventRequestComponent;
  let fixture: ComponentFixture<WebinarEventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebinarEventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebinarEventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
