import { Component, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { environment } from '@environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
declare var gtag: any;

@Component({
  selector: 'app-google-analytics',
  template: ``,
  styles: [
  ]
})
export class GoogleAnalyticsComponent {
  trackingCode = environment.googleAnalyticsTrackingCode;

  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly renderer: Renderer2,
    private readonly el: ElementRef,
    private router: Router
  ) {
    // BROWSER
    if (isPlatformBrowser(this.platformId)) {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingCode}`;
      script.async = true;
      this.renderer.appendChild(this.el.nativeElement, script);

      const script2 = this.renderer.createElement('script') as HTMLScriptElement;
      const scriptBody = this.renderer.createText(`
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag('js', new Date());
      `);
      this.renderer.appendChild(script2, scriptBody);
      this.renderer.appendChild(this.el.nativeElement, script2);

      router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      ).subscribe((e: NavigationEnd) => {
        gtag('config', this.trackingCode, {'page_path':e.urlAfterRedirects});
      });
    }
  }
}
