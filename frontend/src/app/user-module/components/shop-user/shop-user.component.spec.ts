import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopUserComponent } from './shop-user.component';

describe('ShopUserComponent', () => {
  let component: ShopUserComponent;
  let fixture: ComponentFixture<ShopUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
