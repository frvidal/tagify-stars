import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TagifyStarsComponent } from './tagify-stars/tagify-stars.component';

@NgModule({
  declarations: [
    AppComponent,
    TagifyStarsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
