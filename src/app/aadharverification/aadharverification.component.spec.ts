import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharverificationComponent } from './aadharverification.component';

describe('AadharverificationComponent', () => {
  let component: AadharverificationComponent;
  let fixture: ComponentFixture<AadharverificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadharverificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharverificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
