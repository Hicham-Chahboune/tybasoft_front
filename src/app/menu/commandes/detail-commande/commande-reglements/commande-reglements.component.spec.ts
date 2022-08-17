import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeReglementsComponent } from './commande-reglements.component';

describe('CommandeReglementsComponent', () => {
  let component: CommandeReglementsComponent;
  let fixture: ComponentFixture<CommandeReglementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeReglementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandeReglementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
