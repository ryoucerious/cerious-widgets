import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CeriousWidgetsModule, ColumnMenuPlugin } from 'ngx-cerious-widgets';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CeriousWidgetsModule.forRoot({
      plugins: [
        ColumnMenuPlugin
      ],
      pluginOptions: {
        'ColumnMenu': {
          enableColumnMenu: true,
          enablePinning: true,
          enableGroupBy: true
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
