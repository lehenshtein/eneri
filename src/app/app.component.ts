import { Component, OnInit } from '@angular/core';
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
