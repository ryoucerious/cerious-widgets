import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  AvatarComponent, BadgeComponent, ButtonComponent, ConfirmDialogComponent, CwMenuItem,
  CwToastService, MenuComponent, PopoverDirective, TagComponent, ToastComponent, TooltipDirective
} from 'ngx-cerious-widgets';
import { IconComponent } from '../ui/icon.component';

interface Notice { title: string; detail: string; time: string; severity: 'success' | 'info' | 'warn' | 'danger'; }

/**
 * A realistic "Cerious Admin" application shell: sidebar nav, an in-app topbar
 * with a notifications popover, a user menu, and the single Toast / ConfirmDialog
 * outlets the whole app shares. Composes the widgets the way a real product would.
 */
@Component({
  selector: 'app-demo-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, AvatarComponent, BadgeComponent, ButtonComponent,
    TagComponent, MenuComponent, PopoverDirective, TooltipDirective, ToastComponent, ConfirmDialogComponent,
    IconComponent
  ],
  template: `
    <div class="admin">
      <aside class="admin__sidebar">
        <div class="admin__brand"><span aria-hidden="true">◆</span> Cerious Admin</div>

        <nav class="admin__nav" aria-label="Admin sections">
          <a routerLink="dashboard" routerLinkActive="is-active" class="admin__nav-link">
            <span class="admin__nav-icon" aria-hidden="true"><app-icon name="dashboard" /></span> Dashboard
          </a>
          <a routerLink="products" routerLinkActive="is-active" class="admin__nav-link">
            <span class="admin__nav-icon" aria-hidden="true"><app-icon name="grid" /></span> Products
          </a>
          <a routerLink="customers" routerLinkActive="is-active" class="admin__nav-link">
            <span class="admin__nav-icon" aria-hidden="true"><app-icon name="users" /></span> Customers
          </a>
          <a routerLink="calendar" routerLinkActive="is-active" class="admin__nav-link">
            <span class="admin__nav-icon" aria-hidden="true"><app-icon name="calendar" /></span> Calendar
          </a>
        </nav>

        <div class="admin__spacer"></div>

        <!-- User info opens the account menu (View profile / Settings / Sign out). -->
        <button type="button" class="admin__user" [cwPopover]="userMenu" cwPopoverPlacement="top" aria-label="Account menu">
          <cw-avatar label="JD" />
          <div class="admin__user-meta">
            <span class="admin__user-name">Jane Doe</span>
            <span class="admin__user-role">Store manager</span>
          </div>
          <span class="admin__user-caret" aria-hidden="true">▾</span>
        </button>
        <ng-template #userMenu>
          <cw-menu [items]="userMenuItems" />
        </ng-template>
      </aside>

      <section class="admin__main">
        <header class="admin__topbar">
          <div class="admin__topbar-spacer"></div>
          <button type="button" class="icon-btn" cwTooltip="Notifications" cwTooltipPosition="bottom"
                  [cwPopover]="notifPanel" cwPopoverPlacement="bottom-end" aria-label="Notifications">
            <span class="icon-btn__glyph" aria-hidden="true"><app-icon name="bell" /></span>
            @if (unread()) { <cw-badge [value]="unread()" severity="danger" /> }
          </button>
          <ng-template #notifPanel>
            <div class="notif">
              <div class="notif__head">
                <strong>Notifications</strong>
                <button cwButton size="small" variant="text" (click)="markAllRead()">Mark all read</button>
              </div>
              @for (n of notices(); track n.title) {
                <div class="notif__item">
                  <cw-tag [value]="n.severity" [severity]="n.severity" rounded />
                  <div class="notif__body">
                    <div class="notif__title">{{ n.title }}</div>
                    <div class="notif__detail">{{ n.detail }}</div>
                  </div>
                  <span class="notif__time">{{ n.time }}</span>
                </div>
              } @empty {
                <div class="notif__empty">You're all caught up.</div>
              }
            </div>
          </ng-template>
        </header>

        <div class="admin__content">
          <router-outlet />
        </div>
      </section>
    </div>

    <!-- One outlet each for the whole demo app. -->
    <cw-toast />
    <cw-confirm-dialog />
  `,
  styles: [`
    /* minmax(0, 1fr) (not 1fr) so the content column can shrink below its
       min-content width, letting inner scrollers scroll instead of stretching
       the whole shell wider than the viewport. */
    .admin { display: grid; grid-template-columns: 232px minmax(0, 1fr); min-height: calc(100vh - 61px); background: var(--cw-surface-sunken, var(--cw-surface)); }
    .admin__sidebar {
      display: flex; flex-direction: column; gap: 0.5rem; padding: 1.25rem 0.85rem;
      border-right: 1px solid var(--cw-border); background: var(--cw-surface);
      /* Pin the sidebar (incl. the account footer) below the topbar while the
         main content scrolls. */
      position: sticky; top: 3.75rem; align-self: start;
      height: calc(100vh - 3.75rem); overflow-y: auto;
    }
    .admin__brand { font-weight: 700; font-size: 1.05rem; padding: 0.25rem 0.6rem 0.75rem; color: var(--cw-text); }
    .admin__brand span { color: var(--cw-primary); }
    .admin__nav { display: flex; flex-direction: column; gap: 0.15rem; }
    .admin__nav-link { display: flex; align-items: center; gap: 0.6rem; padding: 0.55rem 0.7rem; border-radius: var(--cw-radius); color: var(--cw-text-muted, var(--cw-text-secondary)); text-decoration: none; font-weight: 500; transition: background 0.12s, color 0.12s; }
    .admin__nav-link:hover { background: var(--cw-surface-hover, var(--cw-surface-sunken)); color: var(--cw-text); }
    .admin__nav-link.is-active { background: var(--cw-primary-soft, var(--cw-surface-sunken)); color: var(--cw-primary); }
    .admin__nav-icon { display: inline-flex; align-items: center; justify-content: center; width: 1.15rem; }
    .admin__nav-icon app-icon { width: 18px; height: 18px; display: block; }
    .admin__spacer { flex: 1 1 auto; }

    .admin__user { display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem; border: none; border-top: 1px solid var(--cw-border); background: transparent; width: 100%; cursor: pointer; text-align: left; border-radius: 0; }
    .admin__user:hover { background: var(--cw-surface-hover, var(--cw-surface-sunken)); }
    .admin__user-meta { display: flex; flex-direction: column; line-height: 1.25; flex: 1 1 auto; min-width: 0; }
    .admin__user-name { font-weight: 600; font-size: 0.9rem; color: var(--cw-text); }
    .admin__user-role { font-size: 0.78rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .admin__user-caret { color: var(--cw-text-muted, var(--cw-text-secondary)); }

    .admin__main { display: flex; flex-direction: column; min-width: 0; }
    .admin__topbar { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 2rem; border-bottom: 1px solid var(--cw-border); background: var(--cw-surface); }
    .admin__topbar-spacer { flex: 1 1 auto; }
    .icon-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 38px; height: 38px; border: 1px solid var(--cw-border); border-radius: var(--cw-radius); background: var(--cw-surface); cursor: pointer; font-size: 1.05rem; }
    .icon-btn:hover { background: var(--cw-surface-hover, var(--cw-surface-sunken)); }
    .icon-btn cw-badge { position: absolute; top: -6px; right: -6px; }
    .icon-btn__glyph { display: inline-flex; color: var(--cw-text-secondary); }
    .icon-btn__glyph app-icon { width: 20px; height: 20px; display: block; }
    .admin__content { padding: 1.75rem 2rem; min-width: 0; }

    .notif { width: 320px; max-width: 90vw; }
    .notif__head { display: flex; align-items: center; justify-content: space-between; padding: 0.25rem 0.25rem 0.5rem; border-bottom: 1px solid var(--cw-divider); margin-bottom: 0.25rem; }
    .notif__item { display: flex; align-items: flex-start; gap: 0.6rem; padding: 0.6rem 0.25rem; border-bottom: 1px solid var(--cw-divider); }
    .notif__item:last-child { border-bottom: none; }
    .notif__body { flex: 1 1 auto; min-width: 0; }
    .notif__title { font-weight: 600; font-size: 0.88rem; color: var(--cw-text); }
    .notif__detail { font-size: 0.8rem; color: var(--cw-text-muted, var(--cw-text-secondary)); }
    .notif__time { font-size: 0.72rem; color: var(--cw-text-muted, var(--cw-text-secondary)); white-space: nowrap; }
    .notif__empty { padding: 1.5rem; text-align: center; color: var(--cw-text-muted, var(--cw-text-secondary)); }

    @media (max-width: 720px) {
      .admin { grid-template-columns: minmax(0, 1fr); }

      /* The sidebar becomes a compact nav strip under the topbar: the links
         scroll horizontally and the account button stays pinned at the end,
         instead of the whole panel wrapping and eating the screen.
         min-width:0 overrides the grid item's automatic min-content minimum,
         without it the nav's full width forces the whole shell wider than the
         screen and .admin__nav never actually scrolls. */
      .admin__sidebar {
        position: sticky; top: 3.75rem; z-index: 20;
        flex-direction: row; align-items: center; gap: 0.5rem;
        height: auto; overflow: visible;
        min-width: 0;
        padding: 0.5rem 0.75rem;
        border-right: none; border-bottom: 1px solid var(--cw-border);
        /* Frosted like the topbar: this strip floats over scrolling content and
           --cw-surface is translucent under Frost, so it needs the blur to stay
           readable. */
        background: color-mix(in srgb, var(--cw-surface) 92%, transparent);
        backdrop-filter: blur(12px) saturate(1.4);
        -webkit-backdrop-filter: blur(12px) saturate(1.4);
      }
      .admin__brand { display: none; }
      .admin__spacer { display: none; }

      .admin__nav {
        flex: 1 1 auto; min-width: 0;
        flex-direction: row; gap: 0.25rem;
        overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
      }
      .admin__nav::-webkit-scrollbar { display: none; }
      .admin__nav-link { padding: 0.45rem 0.6rem; font-size: 0.875rem; white-space: nowrap; }

      .admin__user {
        flex: none; width: auto; margin-left: 0;
        padding: 0.25rem; border-top: none; border-radius: var(--cw-radius);
      }
      .admin__user-meta, .admin__user-caret { display: none; }

      .admin__topbar { padding: 0.5rem 1rem; }
      .admin__content { padding: 1.25rem 1rem; }
    }
  `]
})
export class DemoShellComponent {
  private readonly router = inject(Router);
  private readonly toast = inject(CwToastService);

  readonly notices = signal<Notice[]>([
    { title: 'New order #10245', detail: 'Ada Lovelace · $45.00', time: '2m', severity: 'success' },
    { title: 'Low stock', detail: 'Aurora Headphones · 4 left', time: '1h', severity: 'warn' },
    { title: 'Refund requested', detail: 'Order #10240 · $360.00', time: '3h', severity: 'danger' }
  ]);
  readonly unread = computed(() => this.notices().length);

  readonly userMenuItems: CwMenuItem[] = [
    { label: 'View profile', icon: '◍', command: () => this.router.navigate(['/app/profile']) },
    { label: 'Account settings', icon: '⚙', command: () => this.router.navigate(['/app/profile']) },
    { separator: true },
    { label: 'Sign out', icon: '⎋', danger: true, command: () => this.toast.show({ severity: 'info', summary: 'Signed out', detail: 'You have been signed out.' }) }
  ];

  markAllRead(): void {
    this.notices.set([]);
    this.toast.show({ severity: 'success', summary: 'Notifications cleared', detail: 'All caught up.' });
  }
}
