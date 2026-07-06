import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { ScrollTopComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-scroll-top-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollTopComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="scroll-top"><doc-tab label="Features">
      <doc-section title="Scroll the box" description="Scroll down inside the box — the button appears fixed at the bottom-right of the screen and returns the box to the top." [code]="code">
        <div #box style="width: 100%; max-width: 24rem; height: 14rem; overflow: auto; border: 1px solid var(--cw-border); border-radius: var(--cw-radius); padding: 1rem;">
          @for (row of rows; track row) {
            <p style="margin: 0 0 0.75rem;">Line {{ row }} — scroll down to reveal the button.</p>
          }
        </div>
        <cw-scroll-top [target]="boxEl()?.nativeElement ?? null" [threshold]="120" />
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class ScrollTopDocComponent {
  readonly apiProps = [
    { name: "target", type: "HTMLElement | null", default: "null", description: "Element to watch/scroll; defaults to the window." },
    { name: "threshold", type: "number", default: "200", description: "Scroll distance (px) before the button appears." },
    { name: "smooth", type: "boolean", default: "true", description: "Use smooth scrolling." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-primary", description: "Primary / brand accent." },
    { token: "--cw-primary-hover", description: "Primary accent hover state." },
    { token: "--cw-focus-ring", description: "Keyboard focus outline." },
    { token: "--cw-shadow-lg", description: "Large elevation shadow." },
    { token: "--cw-text-on-accent", description: "Themed via this token." }
  ];

  readonly boxEl = viewChild<ElementRef<HTMLElement>>('box');
  rows = Array.from({ length: 40 }, (_, i) => i + 1);

  code = `<cw-scroll-top />                    <!-- watches the window -->
<cw-scroll-top [target]="scrollBox" /> <!-- watches an element -->`;
}
