import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HcpMasterComponent } from './hcp-master.component';

describe('HcpMasterComponent', () => {
  let component: HcpMasterComponent;
  let fixture: ComponentFixture<HcpMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HcpMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HcpMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
