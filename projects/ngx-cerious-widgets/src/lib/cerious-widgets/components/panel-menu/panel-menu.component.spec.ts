import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwPanelMenuItem, PanelMenuComponent } from './panel-menu.component';

describe('PanelMenuComponent', () => {
  let fixture: ComponentFixture<PanelMenuComponent>;
  let component: PanelMenuComponent;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PanelMenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(PanelMenuComponent);
    component = fixture.componentInstance;
    commanded = [];
    const items: CwPanelMenuItem[] = [
      { label: 'Files', items: [
        { label: 'Documents', command: () => commanded.push('docs') },
        { label: 'Images', items: [{ label: 'Photos', command: () => commanded.push('photos') }] }
      ] },
      { label: 'Settings', command: () => commanded.push('settings') }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  function items(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-panel-menu__item'));
  }
  function byLabel(label: string): HTMLButtonElement {
    return items().find(b => b.textContent!.trim() === label)!;
  }

  it('shows only top-level items until a group is expanded', () => {
    expect(items().map(b => b.textContent!.trim())).toEqual(['Files', 'Settings']);
  });

  it('expands a group inline on click', () => {
    byLabel('Files').click();
    fixture.detectChanges();
    expect(items().map(b => b.textContent!.trim())).toContain('Documents');
    expect(items().map(b => b.textContent!.trim())).toContain('Images');
  });

  it('supports nested expansion', () => {
    byLabel('Files').click();
    fixture.detectChanges();
    byLabel('Images').click();
    fixture.detectChanges();
    expect(items().map(b => b.textContent!.trim())).toContain('Photos');
  });

  it('runs leaf commands and emits itemClick', () => {
    const clicked: CwPanelMenuItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    byLabel('Settings').click();
    expect(commanded).toEqual(['settings']);
    expect(clicked[0].label).toBe('Settings');
  });

  it('honours the initial expanded flag', () => {
    fixture.componentRef.setInput('items', [
      { label: 'Open', expanded: true, items: [{ label: 'Child' }] }
    ] as CwPanelMenuItem[]);
    fixture.detectChanges();
    expect(items().map(b => b.textContent!.trim())).toContain('Child');
  });
});
