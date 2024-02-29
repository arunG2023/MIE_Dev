import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPendingComponent } from './event-pending.component';

describe('EventPendingComponent', () => {
  let component: EventPendingComponent;
  let fixture: ComponentFixture<EventPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPendingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
