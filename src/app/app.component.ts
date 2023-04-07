import { Component, OnInit } from '@angular/core';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawerMode } from '@angular/material/sidenav';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSidebar = true;
  modeSidebar: MatDrawerMode = 'side';
  backdropSidebar = false;
  hideSidebarOnClick = false;
  constructor (
    private authHttpService: AuthHttpService,
    private breakpointObserver: BreakpointObserver,
    public sharedService: SharedService) {
  }

  ngOnInit (): void {
    this.tryLogin();
    this.resize();
  }

  private tryLogin () {
    const token = this.authHttpService.token;
    if (token && !this.authHttpService.isTokenExpired()) {
      this.authHttpService.setAllUserData(token);
    }
  }

  private resize () {
    this.breakpointObserver.observe([
      '(max-width: 900px)',
      '(max-width: 1180px)'
    ]).subscribe((result: BreakpointState) => {
      if (result.breakpoints['(max-width: 1180px)']) {
        this.showSidebar = false;
        this.modeSidebar = 'over';
        this.backdropSidebar = true;
        this.hideSidebarOnClick = true;
      } else {
        this.showSidebar = true;
        this.modeSidebar = 'side';
        this.backdropSidebar = false;
        this.hideSidebarOnClick = false;
      }
    });
  }

  closeMenu ($event: any) {
    console.log($event);
    this.showSidebar = false;
  }
}
