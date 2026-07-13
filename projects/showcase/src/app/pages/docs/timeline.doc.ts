import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CwTimelineEvent, TimelineComponent } from 'ngx-cerious-widgets';
import { ApiTableComponent, DocPageComponent, DocSectionComponent, DocTabComponent, ThemingNotesComponent } from '../../ui';

@Component({
  selector: 'app-timeline-doc',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimelineComponent, DocPageComponent, DocTabComponent, ThemingNotesComponent, ApiTableComponent, DocSectionComponent],
  template: `
    <doc-page slug="timeline"><doc-tab label="Features">
      <doc-section title="Order tracking" [code]="code">
        <div style="width: 100%; max-width: 26rem;">
          <cw-timeline [events]="events" />
        </div>
      </doc-section>
    </doc-tab><doc-tab label="API"><doc-api [props]="apiProps" [events]="apiEvents" /></doc-tab><doc-tab label="Theming"><doc-theming [tokens]="themeTokens" /></doc-tab></doc-page>
  `
})
export class TimelineDocComponent {
  readonly apiProps = [
    { name: "events", type: "readonly CwTimelineEvent[]", default: "[]", description: "The events, in order." },
    { name: "showOpposite", type: "boolean", default: "true", description: "Show the opposite-side labels column." }
  ];
  readonly apiEvents = [

  ];
  readonly themeTokens = [
    { token: "--cw-border", description: "Border colour." },
    { token: "--cw-text", description: "Primary text colour." },
    { token: "--cw-text-muted", description: "Muted/subtle text colour." },
    { token: "--cw-font", description: "Font family." },
    { token: "--cw-info", description: "Themed via this token." },
    { token: "--cw-info-bg", description: "Themed via this token." }
  ];

  events: CwTimelineEvent[] = [
    { opposite: 'May 12, 09:00', content: 'Order placed', severity: 'info' },
    { opposite: 'May 12, 11:30', content: 'Payment confirmed', severity: 'success' },
    { opposite: 'May 13, 08:15', content: 'Shipped from warehouse', severity: 'success' },
    { opposite: 'May 14, 14:40', content: 'Out for delivery', severity: 'warn' },
    { opposite: 'May 14, 17:02', content: 'Delivered', severity: 'success' }
  ];

  code = `<cw-timeline [events]="[
  { opposite: '09:00', content: 'Order placed', severity: 'info' },
  { opposite: '11:30', content: 'Shipped', severity: 'success' }
]" />`;
}
