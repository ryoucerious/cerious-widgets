// filepath: /Users/jared/Repos/cerious-widgets/projects/cerious-app/src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CeriousWidgetsModule, ColumnMenuPlugin } from 'ngx-cerious-widgets';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      FormsModule,
      CeriousWidgetsModule.forRoot({
        plugins: [ColumnMenuPlugin],
        pluginOptions: {
          'ColumnMenu': {
            enableColumnMenu: true,
            enablePinning: true,
            enableGroupBy: true
          }
        }
      })
    )
  ]
});
