import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  BreadcrumbComponent, ButtonComponent, CalendarComponent, CwCalendarEvent, CwConfirmService,
  CwToastService, DialogComponent, InputTextDirective, SelectButtonComponent
} from 'ngx-cerious-widgets';

const TYPE_COLORS: Record<string, string> = {
  Restock: '#6c63ff', Delivery: '#22c55e', Meeting: '#f59e0b', Deadline: '#ef4444'
};

@Component({
  selector: 'app-demo-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule, BreadcrumbComponent, CalendarComponent, ButtonComponent,
    DialogComponent, InputTextDirective, SelectButtonComponent
  ],
  template: `
    <cw-breadcrumb [items]="crumbs" />

    <header class="page-head">
      <div>
        <h1 class="page-head__title">Calendar</h1>
        <p class="page-head__sub">Click a day to add an event · click an event to remove it.</p>
      </div>
      <div class="head-right">
        <div class="legend">
          <span><i style="background:#6c63ff"></i> Restock</span>
          <span><i style="background:#22c55e"></i> Delivery</span>
          <span><i style="background:#f59e0b"></i> Meeting</span>
          <span><i style="background:#ef4444"></i> Deadline</span>
        </div>
        <button cwButton (click)="openAdd(today)">+ New event</button>
      </div>
    </header>

    <cw-calendar [events]="events()"
                 (dateSelect)="openAdd($event)"
                 (eventClick)="removeEvent($event)" />

    <cw-dialog header="New event" width="26rem"
               [visible]="addVisible()" (visibleChange)="addVisible.set($event)">
      <div class="form">
        <label class="field">
          <span class="field__label">Title</span>
          <input cwInput [(ngModel)]="form.title" placeholder="e.g. Restock: Apparel" />
        </label>
        <div class="field">
          <span class="field__label">Type</span>
          <cw-select-button [options]="types" [(ngModel)]="form.type" />
        </div>
        <div class="field">
          <span class="field__label">Date</span>
          <strong>{{ formDate() ? formDate()!.toDateString() : '' }}</strong>
        </div>
      </div>
      <div cwDialogFooter>
        <button cwButton severity="secondary" variant="outlined" (click)="addVisible.set(false)">Cancel</button>
        <button cwButton (click)="addEvent()">Add event</button>
      </div>
    </cw-dialog>
  `,
  styles: [`
    :host { display: block; }
    .page-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0.25rem 0 1.25rem; flex-wrap: wrap; }
    .page-head__title { margin: 0; font-size: 1.6rem; font-weight: 700; color: var(--cw-text); }
    .page-head__sub { margin: 0.25rem 0 0; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .head-right { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .legend { display: flex; gap: 1rem; align-items: center; }
    .legend span { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .legend i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
    .form { display: flex; flex-direction: column; gap: 1rem; padding: 0.25rem 0 0.5rem; }
    .field { display: flex; flex-direction: column; gap: 0.35rem; }
    .field__label { font-size: 0.85rem; font-weight: 600; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .field input[cwInput] { width: 100%; }
  `]
})
export class DemoCalendarComponent {
  private readonly toast = inject(CwToastService);
  private readonly confirm = inject(CwConfirmService);
  readonly crumbs = [{ label: 'Home', url: '#' }, { label: 'Calendar' }];
  readonly today = new Date();
  readonly types = ['Restock', 'Delivery', 'Meeting', 'Deadline'];

  private day(n: number): Date { return new Date(this.today.getFullYear(), this.today.getMonth(), n); }

  readonly events = signal<CwCalendarEvent[]>([
    { date: this.day(2), title: 'Restock: Electronics', color: TYPE_COLORS['Restock'] },
    { date: this.day(5), title: 'Delivery to Ada Lovelace', color: TYPE_COLORS['Delivery'] },
    { date: this.day(5), title: 'Delivery to Grace Hopper', color: TYPE_COLORS['Delivery'] },
    { date: this.day(9), title: 'Supplier meeting', color: TYPE_COLORS['Meeting'] },
    { date: this.day(9), title: 'Marketing sync', color: TYPE_COLORS['Meeting'] },
    { date: this.day(9), title: 'Inventory audit', color: TYPE_COLORS['Restock'] },
    { date: this.day(9), title: 'Budget review', color: TYPE_COLORS['Meeting'] },
    { date: this.day(14), title: 'Summer sale launch', color: TYPE_COLORS['Deadline'] },
    { date: this.day(18), title: 'Restock: Apparel', color: TYPE_COLORS['Restock'] },
    { date: this.day(21), title: 'Team offsite', color: TYPE_COLORS['Meeting'] },
    { date: this.day(26), title: 'Quarter close deadline', color: TYPE_COLORS['Deadline'] }
  ]);

  readonly addVisible = signal(false);
  readonly formDate = signal<Date | null>(null);
  form: { title: string; type: string } = { title: '', type: 'Meeting' };

  openAdd(date: Date): void {
    this.formDate.set(date);
    this.form = { title: '', type: 'Meeting' };
    this.addVisible.set(true);
  }

  addEvent(): void {
    const title = this.form.title.trim();
    const date = this.formDate();
    if (!title || !date) {
      this.toast.show({ severity: 'warn', summary: 'Title required', detail: 'Give the event a title.' });
      return;
    }
    this.events.update(list => [...list, { date, title, color: TYPE_COLORS[this.form.type] }]);
    this.toast.show({ severity: 'success', summary: 'Event added', detail: `${title} · ${date.toDateString()}` });
    this.addVisible.set(false);
  }

  async removeEvent(event: CwCalendarEvent): Promise<void> {
    const ok = await this.confirm.confirm({
      header: 'Delete event',
      message: `Delete “${event.title}”?`,
      acceptLabel: 'Delete',
      danger: true
    });
    if (!ok) { return; }
    this.events.update(list => list.filter(e => e !== event));
    this.toast.show({ severity: 'danger', summary: 'Event deleted', detail: event.title });
  }
}
