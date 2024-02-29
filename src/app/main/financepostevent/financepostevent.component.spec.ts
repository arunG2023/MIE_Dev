import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceposteventComponent } from './financepostevent.component';

describe('FinanceposteventComponent', () => {
  let component: FinanceposteventComponent;
  let fixture: ComponentFixture<FinanceposteventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceposteventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceposteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
