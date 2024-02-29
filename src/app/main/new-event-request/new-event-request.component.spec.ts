import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventRequestComponent } from './new-event-request.component';

describe('NewEventRequestComponent', () => {
  let component: NewEventRequestComponent;
  let fixture: ComponentFixture<NewEventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewEventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
