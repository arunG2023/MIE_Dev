import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StallFabricationEventRequestComponent } from './stall-fabrication-event-request.component';

describe('StallFabricationEventRequestComponent', () => {
  let component: StallFabricationEventRequestComponent;
  let fixture: ComponentFixture<StallFabricationEventRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StallFabricationEventRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StallFabricationEventRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
