import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreationComponent } from './vendor-creation.component';

describe('VendorCreationComponent', () => {
  let component: VendorCreationComponent;
  let fixture: ComponentFixture<VendorCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorCreationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
