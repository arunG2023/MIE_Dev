import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventSettlementComponent } from './post-event-settlement.component';

describe('PostEventSettlementComponent', () => {
  let component: PostEventSettlementComponent;
  let fixture: ComponentFixture<PostEventSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventSettlementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
