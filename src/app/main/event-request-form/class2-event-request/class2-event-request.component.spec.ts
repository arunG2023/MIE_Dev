import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Class2EventRequestComponent } from './class2-event-request.component';

describe('Class2EventRequestComponent', () => {
  let component: Class2EventRequestComponent;
  let fixture: ComponentFixture<Class2EventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Class2EventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Class2EventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
