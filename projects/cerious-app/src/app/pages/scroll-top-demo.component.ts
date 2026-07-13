import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';
import { ScrollTopComponent } from 'ngx-cerious-widgets';
import { DemoPageComponent, DemoSectionComponent } from '../showcase/ui';

@Component({
  selector: 'app-scroll-top-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ScrollTopComponent, DemoPageComponent, DemoSectionComponent],
  template: `
    <app-demo-page name="ScrollTop" description="A floating button that appears after scrolling past a threshold and smooth-scrolls back to the top.">
      <app-demo-section title="Scroll the box" description="Scroll down inside the box — the button appears fixed at the bottom-right of the screen and returns the box to the top." [code]="code">
        <div #box style="width: 100%; max-width: 24rem; height: 14rem; overflow: auto; border: 1px solid var(--cw-border); border-radius: var(--cw-radius); padding: 1rem;">
          @for (row of rows; track row) {
            <p style="margin: 0 0 0.75rem;">Line {{ row }} — scroll down to reveal the button.</p>
          }
        </div>
        <cw-scroll-top [target]="boxEl()?.nativeElement ?? null" [threshold]="120" />
      </app-demo-section>
    </app-demo-page>
  `
})
export class ScrollTopDemoComponent {
  readonly boxEl = viewChild<ElementRef<HTMLElement>>('box');
  rows = Array.from({ length: 40 }, (_, i) => i + 1);

  code = `<cw-scroll-top />                    <!-- watches the window -->
<cw-scroll-top [target]="scrollBox" /> <!-- watches an element -->`;
}
