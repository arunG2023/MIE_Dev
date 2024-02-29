import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEventListComponent } from './pre-event-list.component';

describe('PreEventListComponent', () => {
  let component: PreEventListComponent;
  let fixture: ComponentFixture<PreEventListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreEventListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
