import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletUiGetComponent } from './wallet-ui-get.component';

describe('WalletUiGetComponent', () => {
  let component: WalletUiGetComponent;
  let fixture: ComponentFixture<WalletUiGetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletUiGetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletUiGetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
