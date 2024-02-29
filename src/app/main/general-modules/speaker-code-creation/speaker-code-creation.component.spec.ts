import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeakerCodeCreationComponent } from './speaker-code-creation.component';

describe('SpeakerCodeCreationComponent', () => {
  let component: SpeakerCodeCreationComponent;
  let fixture: ComponentFixture<SpeakerCodeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpeakerCodeCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpeakerCodeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
