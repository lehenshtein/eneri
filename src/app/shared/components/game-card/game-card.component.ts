import { Component, Input, SecurityContext } from '@angular/core';
import { IGameResponse, IGameSystem } from '@shared/models/game.interface';
import { cities } from '@shared/helpers/cities';
import { ICity } from '@shared/models/city.interface';
import { gameSystems } from '@app/shared/helpers/game-systems';
import { IUser } from '@shared/models/user.interface';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '@shared/components/text-dialog/text-dialog.component';
import { GameHttpService } from '@shared/services/game-http.service';
import { EMPTY, switchMap, take } from 'rxjs';
import { IResponseMessage } from '@shared/models/response-message.interface';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  @Input() game!: IGameResponse;
  @Input() user?: Partial<IUser> | null;
  @Input() detailedCard = false;
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;
  applyText = '';
  columns = [
    {
      columnDef: 'username',
      header: 'Нік',
      cell: (element: any) => `${element.username}`,
      width: '22%'
    },
    {
      columnDef: 'name',
      header: 'Ім\'я',
      cell: (element: any) => `${element.name || ''}`,
      width: '22%'
    },
    {
      columnDef: 'telegram',
      header: 'Телеграм',
      cell: (element: any) => `${element.contactData?.telegram || ''}`,
      width: '22%'
    },
    {
      columnDef: 'phone',
      header: 'Телефон',
      cell: (element: any) => `${element.contactData?.phone || ''}`,
      width: '22%'
    },
    {
      columnDef: 'actions',
      header: 'Дії',
      cell: (element: any) => element,
      width: '12%'
    },
  ];

  masterDisplayedColumns = this.columns.map(c => c.columnDef);
  displayedColumns = [this.columns[0]].map(c => c.columnDef);

  constructor (
    private dialog: MatDialog,
    private gameHttpService: GameHttpService,
    private sharedService: SharedService,
    ) {
  }

  getCity(cityCode: number): ICity | undefined {
    return this.cities.find((city: ICity) => city.code === cityCode);
  }
  getSystem(id: number): IGameSystem | undefined {
    return this.gameSystems.find((system: IGameSystem) => system._id === id);
  }

  confirmDeletingPlayer(data: any, index: number) {
    this.openDeletePlayerDialog(data, index)
  }
  openDeletePlayerDialog(data: any, index: number) {
    const text = `Ви абсолютно точно супер впевнені, що хочете виключити гравця <span class="primary-text semibold">${data.username}</span> з гри?
                  <br>
                  Не забудьте повідомити йому, якщо - так`
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {title: 'Виключення', text, withConfirm: true, auth: false},
      autoFocus: false,
      panelClass: 'bordered-dialog'
    });

    dialogRef.afterClosed().pipe(take(1), switchMap(result => {
      if (result) {
        // return this.gameHttpService.applyToGame(this.game._id);
        console.log(data);
        return EMPTY;
      } else {
        return EMPTY;
      }
    })).pipe(take(1)).subscribe((res: IResponseMessage) => {
      if (res.message === 'success' && this.user && this.user.username) {
        // this.game.players.push({username: this.user.username})
      }
    });
  }

  checkIfUserCanApply (game: IGameResponse) {
    if (game.isSuspended || game.players.length === game.maxPlayers) {
          this.applyText = 'Гру закрито';
      return true;
    }
    if (game.master.username === this.user?.username) {
      this.applyText = 'Ви майстер';
      return true;
    }
    if (game.players.find(player => player.username === this.user?.username)) {
      this.applyText = 'Ви записані';
      return true;
    }
    return false;
  }

  apply ($event: IGameResponse) {
    if (!this.user) {
      this.openApplyDialog('Щоб записатися на гру ви маєте бути зареєстровані або залогінені', false, true);
      return;
    }
    if (!this.user.contactData?.telegram) {
      this.openApplyDialog('Щоб записатися на гру у вас в профілі має бути вказаний телеграм');
      return;
    }
    if ($event.master.username === this.user?.username) {
      this.openApplyDialog('Майстер не може бути гравцем на своїй грі');
      return;
    }
    if ($event.players.length >= $event.maxPlayers || $event.isSuspended) {
      this.openApplyDialog('Набір гравців зупинено');
      return;
    }
    this.openApplyDialog(`Ви впевнені, що хочете записатись на гру - ${this.game.title}?`, true, false);
  }
  openApplyDialog(text: string, withConfirm: boolean = false, auth: boolean = false) {
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {title: 'Запис на гру', text, withConfirm, auth},
      autoFocus: false,
      panelClass: 'bordered-dialog'
    });

    dialogRef.afterClosed().pipe(take(1), switchMap(result => {
      if (result) {
        return this.gameHttpService.applyToGame(this.game._id);
      } else {
        return EMPTY;
      }
    })).pipe(take(1)).subscribe((res: IResponseMessage) => {
      if (res.message === 'success' && this.user && this.user.username) {
        this.game.players.push({username: this.user.username})
      }
    });
  }

  search (tag: string) {
    this.sharedService.searchSubjectSet(tag);
  }
}
