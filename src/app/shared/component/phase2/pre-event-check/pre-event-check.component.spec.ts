import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreEventCheckComponent } from './pre-event-check.component';

describe('PreEventCheckComponent', () => {
  let component: PreEventCheckComponent;
  let fixture: ComponentFixture<PreEventCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreEventCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreEventCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
