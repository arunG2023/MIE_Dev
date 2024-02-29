import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpPostEventFollowUpComponent } from './hcp-post-event-follow-up.component';

describe('HcpPostEventFollowUpComponent', () => {
  let component: HcpPostEventFollowUpComponent;
  let fixture: ComponentFixture<HcpPostEventFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcpPostEventFollowUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcpPostEventFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
