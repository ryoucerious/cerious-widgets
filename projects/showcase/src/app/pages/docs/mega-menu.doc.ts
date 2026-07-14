import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CwMegaMenuItem, MegaMenuComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-mega-menu-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MegaMenuComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="mega-menu"><doc-tab label="Features">
      <doc-section title="Storefront nav" [code]="code">
        <div style="min-height: 16rem;">
          <cw-mega-menu [items]="items" (itemClick)="last.set($event.label)" />
          <p style="color: var(--cw-text-muted); font-size: 0.875rem; margin-top: 0.75rem;">Last: {{ last() }}</p>
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class MegaMenuDocComponent {
  readonly apiProps = [
    { name: "items", type: "readonly CwMegaMenuItem[]", default: "[]", description: "The top-level entries." }
  ];
  readonly apiEvents = [
    { name: "itemClick", type: "CwMegaMenuLink", description: "Emitted when a leaf link is activated." }
  ];
  readonly themeTokens = [
    { token: "--cw-surface", description: "Component background surface." },
    { token: "--cw-surface-hover", description: "Hover background." },
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-accent", description: "Secondary brand accent." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-radius", description: "Corner radius." },
    { token: "--cw-radius-sm", description: "Small corner radius." }
  ];

  readonly last = signal(', ');
  private cmd = (label: string) => ({ label, command: () => this.last.set(label) });

  items: CwMegaMenuItem[] = [
    { label: 'Products', columns: [
      { header: 'Audio', items: [this.cmd('Headphones'), this.cmd('Speakers'), this.cmd('Microphones')] },
      { header: 'Video', items: [this.cmd('Monitors'), this.cmd('Cameras'), this.cmd('Projectors')] },
      { header: 'Accessories', items: [this.cmd('Cables'), this.cmd('Stands'), this.cmd('Cases')] }
    ] },
    { label: 'Solutions', columns: [
      { header: 'By industry', items: [this.cmd('Education'), this.cmd('Healthcare'), this.cmd('Retail')] },
      { header: 'By size', items: [this.cmd('Startup'), this.cmd('Enterprise')] }
    ] },
    { label: 'Support', command: () => this.last.set('Support') }
  ];

  code = `<cw-mega-menu [items]="[
  { label: 'Products', columns: [
    { header: 'Audio', items: [{ label: 'Headphones' }] }
  ] }
]" />`;
}
