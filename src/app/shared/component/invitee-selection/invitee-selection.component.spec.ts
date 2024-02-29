import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteeSelectionComponent } from './invitee-selection.component';

describe('InviteeSelectionComponent', () => {
  let component: InviteeSelectionComponent;
  let fixture: ComponentFixture<InviteeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteeSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
