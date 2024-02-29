import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSelectionComponent } from './panel-selection.component';

describe('PanelSelectionComponent', () => {
  let component: PanelSelectionComponent;
  let fixture: ComponentFixture<PanelSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
