import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppNotificationBarComponent } from './app-notification-bar.component';

describe('AppNotificationBarComponent', () => {
  let component: AppNotificationBarComponent;
  let fixture: ComponentFixture<AppNotificationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppNotificationBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppNotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
