import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonorariumEventListComponent } from './honorarium-event-list.component';

describe('HonorariumEventListComponent', () => {
  let component: HonorariumEventListComponent;
  let fixture: ComponentFixture<HonorariumEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonorariumEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonorariumEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
