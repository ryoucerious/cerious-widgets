import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanelComponent } from './panel.component';

describe('PanelComponent', () => {
  let fixture: ComponentFixture<PanelComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PanelComponent] }).compileComponents();
    fixture = TestBed.createComponent(PanelComponent);
    el = fixture.nativeElement;
  });

  it('renders the header and body content', () => {
    fixture.componentRef.setInput('header', 'Details');
    fixture.detectChanges();
    expect(el.querySelector('.cw-panel__title')!.textContent).toContain('Details');
    expect(el.querySelector('.cw-panel__body')).toBeTruthy();
  });

  it('shows no toggle button when not toggleable', () => {
    fixture.detectChanges();
    expect(el.querySelector('.cw-panel__toggle')).toBeNull();
  });

  it('toggles the body and emits collapsedChange with aria-expanded reflecting state', () => {
    fixture.componentRef.setInput('toggleable', true);
    fixture.detectChanges();
    const toggle = el.querySelector('.cw-panel__toggle') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(el.querySelector('.cw-panel__body')).toBeTruthy();

    const emitted: boolean[] = [];
    fixture.componentInstance.collapsedChange.subscribe(v => emitted.push(v));
    toggle.click();
    fixture.detectChanges();

    expect(emitted).toEqual([true]);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(el.querySelector('.cw-panel__body')).toBeNull();
  });

  it('honours the collapsed input as the initial state', () => {
    fixture.componentRef.setInput('toggleable', true);
    fixture.componentRef.setInput('collapsed', true);
    fixture.detectChanges();
    expect(el.querySelector('.cw-panel__body')).toBeNull();
    expect(fixture.componentInstance.isCollapsed()).toBe(true);
  });
});
