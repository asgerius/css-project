import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartionComponent } from './partion.component';

describe('PartionComponent', () => {
  let component: PartionComponent;
  let fixture: ComponentFixture<PartionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
