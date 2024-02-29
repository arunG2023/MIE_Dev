import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Class1HonorariumRequestComponent } from './class1-honorarium-request.component';

describe('Class1HonorariumRequestComponent', () => {
  let component: Class1HonorariumRequestComponent;
  let fixture: ComponentFixture<Class1HonorariumRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Class1HonorariumRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Class1HonorariumRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
