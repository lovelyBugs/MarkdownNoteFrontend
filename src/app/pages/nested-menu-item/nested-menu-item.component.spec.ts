import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedMenuItemComponent } from './nested-menu-item.component';

describe('NestedMenuItemComponent', () => {
  let component: NestedMenuItemComponent;
  let fixture: ComponentFixture<NestedMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NestedMenuItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NestedMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
