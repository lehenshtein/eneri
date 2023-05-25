import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserHttpService } from '@app/user/user-http.service';
import { take } from 'rxjs';
import { IUserAsMaster, IUserAsPlayer } from '@shared/models/user.interface';

@Component({
  selector: 'app-user-profile.content',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userName = '';
  user?: IUserAsMaster | IUserAsPlayer;
  constructor (private route: ActivatedRoute, private userHttpService: UserHttpService,) {
  }
  ngOnInit (): void {
    this.fetchMaster();
  }

  fetchMaster() {
    this.userName = this.route.snapshot.params['username'] || '';
    if (this.userName) {
      this.userHttpService.fetchUserByUsername(this.userName).pipe(take(1)).subscribe((res: IUserAsMaster) => {
        this.user = res
      })
    }
  }

  getUserTelegram(): string | undefined {
    if (this.user && this.user.gameRole === 'both') {
      const master = <IUserAsMaster>this.user;
      return master.telegram;
    }
    return undefined;
  }

}
