import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CeriousWidgetsModule } from 'ngx-cerious-widgets';
import { FormsModule } from '@angular/forms';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel, faStar } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    CeriousWidgetsModule.forRoot({
      plugins: []
    })
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
  constructor(private fontLibrary: FaIconLibrary) {
    // Add icons to the library for use in the components
    this.fontLibrary.addIcons(
      faFileExcel,
      faStar
    ); 
  }
}
