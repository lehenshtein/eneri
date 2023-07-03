import { LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { HeaderComponent } from './layout/header/header.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from '@shared/interceptors/token.interceptor';
import { ErrorInterceptor } from '@shared/interceptors/error.interceptor';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeUK from '@angular/common/locales/uk';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AboutComponent } from './about/about.component';
import { GoogleAnalyticsComponent } from '@app/google-analytics/google-analytics.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { VerificationComponent } from './verification/verification.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FooterComponent } from './layout/footer/footer.component';
import { ServiceWorkerModule } from '@angular/service-worker';
registerLocaleData(localeUK);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    AboutComponent,
    GoogleAnalyticsComponent,
    AdminPanelComponent,
    VerificationComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),

  ],
  exports: [
    SharedModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'uk-UA' },
    { provide: LOCALE_ID, useValue: 'uk-UA' },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: ErrorInterceptor
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
