import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwDockItem, DockComponent } from './dock.component';

describe('DockComponent', () => {
  let fixture: ComponentFixture<DockComponent>;
  let component: DockComponent;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DockComponent] }).compileComponents();
    fixture = TestBed.createComponent(DockComponent);
    component = fixture.componentInstance;
    commanded = [];
    const items: CwDockItem[] = [
      { label: 'Files', command: () => commanded.push('files') },
      { label: 'Mail', command: () => commanded.push('mail') },
      { label: 'Calendar' },
      { label: 'Trash', disabled: true }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  function itemButtons(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-dock__item'));
  }

  it('renders an item per entry with its glyph', () => {
    expect(itemButtons().length).toBe(4);
    expect(itemButtons()[0].querySelector('.cw-dock__glyph')!.textContent!.trim()).toBe('F');
  });

  it('magnifies the hovered item and its neighbours less', () => {
    expect(component.scale(1)).toBe(1);

    component.hovered.set(1);
    fixture.detectChanges();

    expect(component.scale(1)).toBeCloseTo(1.5, 5);      // peak
    expect(component.scale(2)).toBeGreaterThan(1);        // neighbour bumped
    expect(component.scale(2)).toBeLessThan(component.scale(1));
  });

  it('runs a command and emits itemClick', () => {
    const clicked: CwDockItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    itemButtons()[0].click();
    expect(commanded).toEqual(['files']);
    expect(clicked[0].label).toBe('Files');
  });

  it('ignores disabled items', () => {
    itemButtons()[3].click();
    expect(commanded).toEqual([]);
  });
});
