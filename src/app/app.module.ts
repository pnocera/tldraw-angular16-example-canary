import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppComponent } from './app.component';
import { ReactComponentDirective } from './directives/reactng';
import { CustomshapeComponent } from './components/customshape/customshape.component';
import { createCustomElement } from '@angular/elements';
import { HelloDialogComponent } from './components/hellodialog/hellodialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot({
      prefix: 'tldrawcust',
      separator: '.',
      caseSensitive: true,
    }),
    ReactComponentDirective,
    HelloDialogComponent,
    CustomshapeComponent,

    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    const tlstateElement = createCustomElement(CustomshapeComponent, {
      injector,
    });
    customElements.define('app-customshape', tlstateElement);
  }
}
