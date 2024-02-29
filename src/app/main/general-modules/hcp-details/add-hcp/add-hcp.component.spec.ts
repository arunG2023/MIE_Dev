import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHcpComponent } from './add-hcp.component';

describe('AddHcpComponent', () => {
  let component: AddHcpComponent;
  let fixture: ComponentFixture<AddHcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddHcpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
