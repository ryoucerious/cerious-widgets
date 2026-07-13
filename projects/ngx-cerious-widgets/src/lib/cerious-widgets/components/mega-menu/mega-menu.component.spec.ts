import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwMegaMenuItem, CwMegaMenuLink, MegaMenuComponent } from './mega-menu.component';

describe('MegaMenuComponent', () => {
  let fixture: ComponentFixture<MegaMenuComponent>;
  let component: MegaMenuComponent;
  let overlayContainer: OverlayContainer;
  let commanded: string[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [MegaMenuComponent] }).compileComponents();
    fixture = TestBed.createComponent(MegaMenuComponent);
    component = fixture.componentInstance;
    overlayContainer = TestBed.inject(OverlayContainer);
    commanded = [];
    const items: CwMegaMenuItem[] = [
      { label: 'Products', columns: [
        { header: 'Audio', items: [{ label: 'Headphones', command: () => commanded.push('hp') }, { label: 'Speakers' }] },
        { header: 'Video', items: [{ label: 'Monitors' }] }
      ] },
      { label: 'Support', command: () => commanded.push('support') }
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function rootItems(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.cw-mega-menu__item'));
  }
  function columns(): HTMLElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-mega-menu__column'));
  }
  function links(): HTMLButtonElement[] {
    return Array.from(overlayContainer.getContainerElement().querySelectorAll('.cw-mega-menu__link'));
  }

  it('renders top-level items with a caret for mega parents', () => {
    expect(rootItems().map(b => b.textContent!.trim())).toEqual(['Products', 'Support']);
    expect(rootItems()[0].querySelector('.cw-mega-menu__caret')).toBeTruthy();
    expect(rootItems()[1].querySelector('.cw-mega-menu__caret')).toBeNull();
  });

  it('opens a multi-column panel and runs a leaf command', () => {
    rootItems()[0].click();
    fixture.detectChanges();

    expect(columns().length).toBe(2);
    expect(columns()[0].querySelector('.cw-mega-menu__column-header')!.textContent!.trim()).toBe('Audio');

    links().find(l => l.textContent!.includes('Headphones'))!.click();
    fixture.detectChanges();
    expect(commanded).toEqual(['hp']);
    expect(component.openItem()).toBeNull(); // closes after activation
  });

  it('runs a leaf root command directly without a panel', () => {
    const clicked: CwMegaMenuLink[] = [];
    component.itemClick.subscribe(l => clicked.push(l));

    rootItems()[1].click();
    expect(commanded).toEqual(['support']);
    expect(columns().length).toBe(0);
  });

  it('toggles the panel closed on second click', () => {
    rootItems()[0].click();
    fixture.detectChanges();
    expect(component.openItem()).toBeTruthy();

    rootItems()[0].click();
    fixture.detectChanges();
    expect(component.openItem()).toBeNull();
  });
});
