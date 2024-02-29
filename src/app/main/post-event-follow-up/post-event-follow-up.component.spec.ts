import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventFollowUpComponent } from './post-event-follow-up.component';

describe('PostEventFollowUpComponent', () => {
  let component: PostEventFollowUpComponent;
  let fixture: ComponentFixture<PostEventFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventFollowUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
