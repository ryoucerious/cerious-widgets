import { OverlayContainer } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CwMenuItem } from '../menu/menu.component';
import { ContextMenuDirective } from './context-menu.directive';

@Component({
  standalone: true,
  imports: [ContextMenuDirective],
  template: `<div class="target" [cwContextMenu]="items">Right-click me</div>`
})
class HostComponent {
  clicked: string[] = [];
  items: CwMenuItem[] = [
    { label: 'Rename', command: () => this.clicked.push('rename') },
    { label: 'Delete', danger: true }
  ];
}

describe('ContextMenuDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  function target(): HTMLElement {
    return fixture.nativeElement.querySelector('.target');
  }
  function menu(): HTMLElement | null {
    return overlayContainer.getContainerElement().querySelector('cw-menu');
  }

  it('opens the menu on contextmenu and runs commands', () => {
    target().dispatchEvent(new MouseEvent('contextmenu', { clientX: 50, clientY: 60, cancelable: true, bubbles: true }));
    fixture.detectChanges();

    expect(menu()).toBeTruthy();
    expect(menu()!.textContent).toContain('Rename');

    const rename = Array.from(menu()!.querySelectorAll('.cw-menu__item')).find(b => b.textContent!.includes('Rename')) as HTMLButtonElement;
    rename.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.clicked).toEqual(['rename']);
    expect(menu()).toBeNull(); // closes after activation
  });

  it('closes on Escape', () => {
    target().dispatchEvent(new MouseEvent('contextmenu', { clientX: 10, clientY: 10, cancelable: true, bubbles: true }));
    fixture.detectChanges();
    expect(menu()).toBeTruthy();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(menu()).toBeNull();
  });
});
