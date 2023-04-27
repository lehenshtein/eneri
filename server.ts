import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import 'node-window-polyfill/register';
import 'localstorage-polyfill';

import { AppServerModule } from './src/main.server';
import { enableProdMode } from '@angular/core';

enableProdMode();
const DIST_FOLDER = join(process.cwd(), 'dist/eneri/browser');
const template = readFileSync(join(DIST_FOLDER, 'index.html')).toString();
const domino = require('domino');
const win = domino.createWindow(template);
global['localStorage'] = win.localStorage;
global['window'] = win;
global['document'] = win.document;
global['Document'] = win.document;
global['DOMTokenList'] = win.DOMTokenList;
global['Node'] = win.Node;
global['Text'] = win.Text;
global['HTMLElement'] = win.HTMLElement;
global['navigator'] = win.navigator;
global['KeyboardEvent'] = win.KeyboardEvent;
global['MouseEvent'] = win.MouseEvent;
global['FocusEvent'] = win.FocusEvent;
(global as any).object = win.object;
global['sessionStorage'] = win.sessionStorage;
global['screen'] = win.screen;
global['MutationObserver'] = getMockMutationObserver();

function getMockMutationObserver() {
  return class {
    observe() {}

    disconnect() {}

    takeRecords() {
      return [];
    }
  };
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/eneri/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1d'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
