import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpeakerComponent } from './edit-speaker.component';

describe('EditSpeakerComponent', () => {
  let component: EditSpeakerComponent;
  let fixture: ComponentFixture<EditSpeakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSpeakerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpeakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
