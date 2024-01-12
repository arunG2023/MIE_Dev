import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventListComponent } from './post-event-list.component';

describe('PostEventListComponent', () => {
  let component: PostEventListComponent;
  let fixture: ComponentFixture<PostEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
