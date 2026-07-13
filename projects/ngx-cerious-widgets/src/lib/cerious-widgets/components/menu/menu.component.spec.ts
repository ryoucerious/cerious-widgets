import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwMenuItem, MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let fixture: ComponentFixture<MenuComponent>;
  let component: MenuComponent;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    commanded = [];
    fixture.componentRef.setInput('items', [
      { label: 'Edit', command: () => commanded.push('edit') },
      { label: 'Duplicate', disabled: true },
      { separator: true },
      { label: 'Delete', danger: true }
    ] as CwMenuItem[]);
    fixture.detectChanges();
  });

  function items(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-menu__item'));
  }

  it('renders items, separators, danger and disabled states', () => {
    expect(items().length).toBe(3);
    expect(fixture.nativeElement.querySelectorAll('.cw-menu__separator').length).toBe(1);
    expect(items()[1].disabled).toBeTrue();
    expect(items()[2].classList).toContain('cw-menu__item--danger');
  });

  it('runs the command and emits itemClick on activation', () => {
    const clicked: CwMenuItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    items()[0].click();
    fixture.detectChanges();

    expect(commanded).toEqual(['edit']);
    expect(clicked.length).toBe(1);
    expect(clicked[0].label).toBe('Edit');
  });

  it('ignores disabled items', () => {
    const clicked: CwMenuItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));
    items()[1].click();
    expect(clicked).toEqual([]);
  });

  it('highlights the active index', () => {
    fixture.componentRef.setInput('activeIndex', 0);
    fixture.detectChanges();
    expect(items()[0].classList).toContain('cw-menu__item--active');
  });
});
