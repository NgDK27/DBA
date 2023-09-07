import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDetailUserComponent } from './shop-detail-user.component';

describe('ShopDetailUserComponent', () => {
  let component: ShopDetailUserComponent;
  let fixture: ComponentFixture<ShopDetailUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDetailUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopDetailUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
