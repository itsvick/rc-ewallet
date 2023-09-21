import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestCorrectionComponent } from './request-correction.component';

describe('RequestCorrectionComponent', () => {
  let component: RequestCorrectionComponent;
  let fixture: ComponentFixture<RequestCorrectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestCorrectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
