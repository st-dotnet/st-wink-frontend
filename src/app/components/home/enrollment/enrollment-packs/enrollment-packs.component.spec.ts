import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentPacksComponent } from './enrollment-packs.component';

describe('EnrollmentPacksComponent', () => {
  let component: EnrollmentPacksComponent;
  let fixture: ComponentFixture<EnrollmentPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollmentPacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
