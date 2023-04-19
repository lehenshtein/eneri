import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserHttpService } from '@app/user/user-http.service';
import { take } from 'rxjs';
import { IUserAsMaster } from '@shared/models/user.interface';

@Component({
  selector: 'app-user-as-master.content',
  templateUrl: './user-as-master.component.html',
  styleUrls: ['./user-as-master.component.scss']
})
export class UserAsMasterComponent implements OnInit {
  masterName = '';
  master?: IUserAsMaster;
  constructor (private route: ActivatedRoute, private userHttpService: UserHttpService,) {
  }
  ngOnInit (): void {
    this.fetchMaster();
  }

  fetchMaster() {
    this.masterName = this.route.snapshot.params['username'] || '';
    if (this.masterName) {
      this.userHttpService.fetchUserByUsername(this.masterName).pipe(take(1)).subscribe((res: IUserAsMaster) => {
        this.master = res
      })
    }
  }

}
