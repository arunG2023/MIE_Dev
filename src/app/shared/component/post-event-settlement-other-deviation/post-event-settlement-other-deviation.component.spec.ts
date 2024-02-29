import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEventSettlementOtherDeviationComponent } from './post-event-settlement-other-deviation.component';

describe('PostEventSettlementOtherDeviationComponent', () => {
  let component: PostEventSettlementOtherDeviationComponent;
  let fixture: ComponentFixture<PostEventSettlementOtherDeviationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostEventSettlementOtherDeviationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostEventSettlementOtherDeviationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
