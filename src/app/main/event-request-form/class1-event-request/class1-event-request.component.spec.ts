import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Class1EventRequestComponent } from './class1-event-request.component';

describe('Class1EventRequestComponent', () => {
  let component: Class1EventRequestComponent;
  let fixture: ComponentFixture<Class1EventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Class1EventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Class1EventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
