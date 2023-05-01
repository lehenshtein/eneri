import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';
import '@angular/platform-server/init';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
export { renderModule } from '@angular/platform-server';
