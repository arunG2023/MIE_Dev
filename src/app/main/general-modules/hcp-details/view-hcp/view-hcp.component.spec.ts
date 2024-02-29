import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHcpComponent } from './view-hcp.component';

describe('ViewHcpComponent', () => {
  let component: ViewHcpComponent;
  let fixture: ComponentFixture<ViewHcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHcpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewHcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
