import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HonarariumListComponent } from './honararium-list.component';

describe('HonarariumListComponent', () => {
  let component: HonarariumListComponent;
  let fixture: ComponentFixture<HonarariumListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HonarariumListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HonarariumListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
