import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTrainersComponent } from './view-trainers.component';

describe('ViewTrainersComponent', () => {
  let component: ViewTrainersComponent;
  let fixture: ComponentFixture<ViewTrainersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTrainersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
