import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventDataFollowUpComponent } from './post-event-data-follow-up.component';

describe('PostEventDataFollowUpComponent', () => {
  let component: PostEventDataFollowUpComponent;
  let fixture: ComponentFixture<PostEventDataFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventDataFollowUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventDataFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
