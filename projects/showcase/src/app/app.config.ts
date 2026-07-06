import { ApplicationConfig, importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import {
  CeriousWidgetsModule,
  ColumnMenuPlugin,
  ColumnVisibilityPlugin,
  ExportToExcelPlugin,
  GlobalTextFilterPlugin,
  MultiSortPlugin,
  SaveGridStatePlugin
} from 'ngx-cerious-widgets';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // The library's Grid (and its signal-driven pipeline) is built for zoneless
    // change detection, matching the reference app.
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })
    ),
    importProvidersFrom(
      FormsModule,
      // Register every grid plugin so Grid demos can turn on what they need.
      CeriousWidgetsModule.forRoot({
        plugins: [
          ColumnMenuPlugin,
          ColumnVisibilityPlugin,
          GlobalTextFilterPlugin,
          MultiSortPlugin,
          ExportToExcelPlugin,
          SaveGridStatePlugin
        ]
      })
    )
  ]
};
