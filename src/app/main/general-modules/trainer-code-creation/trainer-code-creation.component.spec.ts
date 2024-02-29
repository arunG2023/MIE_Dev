import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerCodeCreationComponent } from './trainer-code-creation.component';

describe('TrainerCodeCreationComponent', () => {
  let component: TrainerCodeCreationComponent;
  let fixture: ComponentFixture<TrainerCodeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainerCodeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainerCodeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
