import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSpeakersComponent } from './view-speakers.component';

describe('ViewSpeakersComponent', () => {
  let component: ViewSpeakersComponent;
  let fixture: ComponentFixture<ViewSpeakersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSpeakersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSpeakersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
