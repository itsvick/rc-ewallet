import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportuntiesComponent } from './opportunties.component';

describe('OpportuntiesComponent', () => {
  let component: OpportuntiesComponent;
  let fixture: ComponentFixture<OpportuntiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpportuntiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportuntiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
