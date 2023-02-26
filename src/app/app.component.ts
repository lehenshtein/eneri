import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthHttpService } from '@shared/services/auth-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showNavbar = true;
  constructor (private authHttpService: AuthHttpService) {
  }

  @ViewChild('drawer')
  private sidenav: any;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sidenav.open();
    }, 250);
  }

  ngOnInit (): void {
    this.tryLogin()
  }

  private tryLogin () {
    const token = this.authHttpService.token;
    if (token && !this.authHttpService.isTokenExpired()) {
      this.authHttpService.setAllUserData(token);
    }
  }
}
