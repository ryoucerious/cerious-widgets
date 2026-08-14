import { inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const GA_MEASUREMENT_ID = 'G-WN66VJJHRX';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends a GA4 page_view on client-side route changes. The initial load is sent by the gtag snippet. */
export function trackSpaPageViews(): void {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return;
  }

  const router = inject(Router);
  let isInitialLoad = true;
  router.events
    .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event) => {
      if (isInitialLoad) {
        isInitialLoad = false;
        return;
      }
      window.gtag?.('event', 'page_view', {
        send_to: GA_MEASUREMENT_ID,
        page_path: event.urlAfterRedirects,
        page_location: window.location.href,
        page_title: document.title
      });
    });
}
