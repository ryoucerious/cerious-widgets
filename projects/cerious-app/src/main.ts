// filepath: /Users/jared/Repos/cerious-widgets/projects/cerious-app/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CeriousWidgetsModule,
  ColumnMenuPlugin,
  ColumnVisibilityPlugin,
  ExportToExcelPlugin,
  GlobalTextFilterPlugin,
  MultiSortPlugin,
  SaveGridStatePlugin
} from 'ngx-cerious-widgets';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    // Enable zoneless change detection for better performance
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    importProvidersFrom(
      FormsModule,
      // Register every grid plugin; each feature page turns the ones it needs
      // on via its own [pluginOptions] (plugins no-op when not enabled).
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
});
