import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWorkerComponent } from './wallet-worker.component';

describe('WalletWorkerComponent', () => {
  let component: WalletWorkerComponent;
  let fixture: ComponentFixture<WalletWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletWorkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
