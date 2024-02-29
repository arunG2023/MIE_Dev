import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MastersListComponent } from './masters-list.component';

describe('MastersListComponent', () => {
  let component: MastersListComponent;
  let fixture: ComponentFixture<MastersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MastersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MastersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
