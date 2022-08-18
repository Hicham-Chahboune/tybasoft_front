import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedCommandDetailComponent } from './shared-command-detail.component';

describe('SharedCommandDetailComponent', () => {
  let component: SharedCommandDetailComponent;
  let fixture: ComponentFixture<SharedCommandDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedCommandDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedCommandDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
