import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunitieComponent } from './opportunitie.component';

describe('OpportunitieComponent', () => {
  let component: OpportunitieComponent;
  let fixture: ComponentFixture<OpportunitieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportunitieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunitieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
