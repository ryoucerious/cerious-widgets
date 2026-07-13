import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwTieredMenuItem, TieredMenuComponent } from './tiered-menu.component';

describe('TieredMenuComponent', () => {
  let fixture: ComponentFixture<TieredMenuComponent>;
  let component: TieredMenuComponent;
  let overlayContainer: OverlayContainer;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TieredMenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(TieredMenuComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    commanded = [];
    const items: CwTieredMenuItem[] = [
      { label: 'File', items: [
        { label: 'New', command: () => commanded.push('new') },
        { label: 'Recent', items: [{ label: 'Doc 1', command: () => commanded.push('doc1') }] }
      ] },
      { separator: true },
      { label: 'Exit', command: () => commanded.push('exit') }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function rootItems(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-tiered-menu__item'));
  }
  function overlayItems(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-tiered-menu__item'));
  }

  it('renders items, a caret for parents and a separator', () => {
    expect(rootItems().map(b => b.textContent!.trim())).toEqual(['File', 'Exit']);
    expect(rootItems()[0].querySelector('.cw-tiered-menu__caret')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.cw-tiered-menu__separator').length).toBe(1);
  });

  it('opens a submenu on hovering a parent', () => {
    rootItems()[0].dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    expect(component.openItem()).toBeTruthy();
    expect(overlayItems().map(b => b.textContent!.trim())).toEqual(['New', 'Recent']);
  });

  it('runs a leaf command and requests close', () => {
    const clicked: CwTieredMenuItem[] = [];
    let closeRequested = false;
    component.itemClick.subscribe(i => clicked.push(i));
    component.closeRequest.subscribe(() => (closeRequested = true));

    rootItems()[1].click(); // "Exit" leaf
    expect(commanded).toEqual(['exit']);
    expect(clicked[0].label).toBe('Exit');
    expect(closeRequested).toBeTrue();
  });

  it('bubbles a nested submenu activation up to the root', () => {
    const clicked: CwTieredMenuItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    rootItems()[0].dispatchEvent(new MouseEvent('mouseenter')); // open File
    fixture.detectChanges();
    // Hover "Recent" to open the nested submenu.
    const recent = overlayItems().find(b => b.textContent!.includes('Recent'))!;
    recent.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const doc1 = overlayItems().find(b => b.textContent!.includes('Doc 1'))!;
    doc1.click();
    expect(commanded).toContain('doc1');
    expect(clicked.some(i => i.label === 'Doc 1')).toBeTrue();
  });
});
