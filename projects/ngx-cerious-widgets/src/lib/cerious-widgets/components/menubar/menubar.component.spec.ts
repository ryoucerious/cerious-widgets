import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwMenubarItem, MenubarComponent } from './menubar.component';

describe('MenubarComponent', () => {
  let fixture: ComponentFixture<MenubarComponent>;
  let component: MenubarComponent;
  let overlayContainer: OverlayContainer;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MenubarComponent] }).compileComponents();
    fixture = TestBed.createComponent(MenubarComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    commanded = [];
    const items: CwMenubarItem[] = [
      { label: 'File', items: [
        { label: 'New', command: () => commanded.push('new') },
        { label: 'Open' }
      ] },
      { label: 'Help', command: () => commanded.push('help') }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function rootItems(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-menubar__item'));
  }
  function subItems(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-menubar__subitem'));
  }

  it('renders top-level items with a caret for parents', () => {
    expect(rootItems().map(b => b.textContent!.trim())).toEqual(['File', 'Help']);
    expect(rootItems()[0].querySelector('.cw-menubar__caret')).toBeTruthy();
    expect(rootItems()[1].querySelector('.cw-menubar__caret')).toBeNull();
  });

  it('opens a dropdown for a parent and runs a sub-command', () => {
    rootItems()[0].click();
    fixture.detectChanges();

    expect(subItems().map(b => b.textContent!.trim())).toEqual(['New', 'Open']);
    expect(component.openItem()).toBeTruthy();

    subItems()[0].click();
    fixture.detectChanges();

    expect(commanded).toEqual(['new']);
    expect(component.openItem()).toBeNull(); // closes after activation
  });

  it('runs a leaf command directly and emits itemClick', () => {
    const clicked: CwMenubarItem[] = [];
    component.itemClick.subscribe(i => clicked.push(i));

    rootItems()[1].click();
    fixture.detectChanges();

    expect(commanded).toEqual(['help']);
    expect(clicked[0].label).toBe('Help');
    expect(subItems().length).toBe(0);
  });

  it('toggles a dropdown closed on second click', () => {
    rootItems()[0].click();
    fixture.detectChanges();
    expect(component.openItem()).toBeTruthy();

    rootItems()[0].click();
    fixture.detectChanges();
    expect(component.openItem()).toBeNull();
  });
});
