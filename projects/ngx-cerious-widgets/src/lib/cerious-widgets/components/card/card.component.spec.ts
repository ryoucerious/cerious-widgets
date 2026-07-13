import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { PanelComponent } from '../panel/panel.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  standalone: true,
  imports: [CardComponent, PanelComponent, ToolbarComponent],
  template: `
    <cw-card title="Report" subtitle="June">Body text<div cwCardFooter>Footer</div></cw-card>
    <cw-panel header="Details" toggleable (collapsedChange)="collapsed = $event">Panel body</cw-panel>
    <cw-toolbar>
      <div cwToolbarStart>Left</div>
      <div cwToolbarEnd>Right</div>
    </cw-toolbar>
  `
})
class HostComponent {
  collapsed = false;
}

describe('Card / Panel / Toolbar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
  });

  it('renders card title, subtitle, body and footer', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('cw-card') as HTMLElement;

    expect(card.querySelector('.cw-card__title')!.textContent).toBe('Report');
    expect(card.querySelector('.cw-card__subtitle')!.textContent).toBe('June');
    expect(card.querySelector('.cw-card__body')!.textContent).toContain('Body text');
    expect(card.querySelector('.cw-card__footer')!.textContent).toContain('Footer');
  });

  it('toggles the panel body and emits collapsedChange', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const panel = fixture.nativeElement.querySelector('cw-panel') as HTMLElement;

    expect(panel.querySelector('.cw-panel__body')).toBeTruthy();

    (panel.querySelector('.cw-panel__toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(panel.querySelector('.cw-panel__body')).toBeNull();
    expect(fixture.componentInstance.collapsed).toBeTrue();
  });

  it('projects toolbar slots', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const toolbar = fixture.nativeElement.querySelector('cw-toolbar') as HTMLElement;

    expect(toolbar.getAttribute('role')).toBe('toolbar');
    expect(toolbar.querySelector('.cw-toolbar__start')!.textContent).toContain('Left');
    expect(toolbar.querySelector('.cw-toolbar__end')!.textContent).toContain('Right');
  });
});
