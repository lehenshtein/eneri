import { Component, Inject, Input, OnInit } from '@angular/core';
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
import { NotificationService } from '@shared/services/notification.service';
import { environment } from '@environment/environment';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit{
  @Input() game!: IGameResponse;
  @Input() user?: Partial<IUser> | null;
  @Input() detailedCard = false;
  @Input() isPreview = false;
  @Input() cardType: 'default' | 'gameRequest' = 'default';
  @Input() isBrowser = false;
  private window!: Window;
  maxDescriptionLetters = 300;
  websiteUrl = environment.url;
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;
  applyText = '';
  isDeviceMobile = typeof navigator.share === 'function' && this.sharedService.getNavigator && this.sharedService.getNavigator.mobile;

  columns = [
    {
      columnDef: 'username',
      verified: (element: any) => element.verified,
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
    @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private gameHttpService: GameHttpService,
    private sharedService: SharedService,
    private notificationService: NotificationService,
    private clipboard: Clipboard
    ) {
    if (this.document.defaultView) {
      this.window = this.document.defaultView;
    }
  }

  ngOnInit() {
    if (this.game && this.game.creator && this.game.creator.username) {
      this.cardType = 'gameRequest';
    }
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
        return this.cardType === 'gameRequest' ?
          this.gameHttpService.removePlayerFromGameRequest(this.game._id, data.username) :
          this.gameHttpService.removePlayerFromGame(this.game._id, data.username);
      } else {
        return EMPTY;
      }
    })).pipe(take(1)).subscribe((res: IResponseMessage) => {
      if (res.message === 'success') {
        const playersArr = [...this.game.players];
        playersArr.splice(index, 1);
        this.game.players = playersArr;
        if (this.game.players.length < this.game.maxPlayers) {
          this.game.isSuspended = false;
        }
        this.notificationService.openSnackBar('success', `Виключено гравця ${data.username}. Телеграм: ${data.contactData.telegram}`, '', 10000);
      }
    });
  }

  checkIfUserCanApply (game: IGameResponse) {
    if (game.isSuspended || (game.players.length === game.maxPlayers) && (game.master && game.master.username)) {
      this.applyText = 'Гру закрито';
      return true;
    }
    if (game.master && game.master.username === this.user?.username) {
      this.applyText = 'Ви майстер';
      return true;
    }
    if (game.creator && game.creator.username === this.user?.username) {
      this.applyText = 'Ви організатор';
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
    if ($event.master && $event.master.username === this.user?.username) {
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
        return this.cardType === 'gameRequest' ? this.gameHttpService.applyToGameRequest(this.game._id) : this.gameHttpService.applyToGame(this.game._id);
      } else {
        return EMPTY;
      }
    })).pipe(take(1)).subscribe((res: IResponseMessage) => {
      if (res.message === 'success' && this.user && this.user.username) {
        this.game.players = [...this.game.players, {username: this.user.username}];
        this.notificationService.openSnackBar('success', 'Ви записані');
      }
    });
  }

  checkIfMasterCanApply (game: IGameResponse) {
    if (game.isSuspended || (game.players.length === game.maxPlayers) && (game.master && game.master.username)) {
      return false;
    }
    if (game.master && game.master.username) {
      return false;
    }
    if (game.creator && game.creator.username === this.user?.username) {
      return false;
    }
    if (game.players.find(player => player.username === this.user?.username)) {
      return false;
    }
    return true;
  }
  applyAsMaster (game: IGameResponse) {
    if (!this.user) {
      this.openApplyDialog('Щоб записатися на гру ви маєте бути зареєстровані або залогінені', false, true);
      return;
    }
    if (!this.user.contactData?.telegram || !this.user.showContacts) {
      this.openApplyDialog('Щоб записатися на гру, як майстер, у вас в профілі має бути вказаний телеграм та активовано показ контактів');
      return;
    }
    this.openApplyMasterDialog()
  }
  openApplyMasterDialog() {
    const text = 'Ви впевнені, що хочете стати МАЙСТРОМ цієї гри?'
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {title: 'Запис на гру, як майстер', text, withConfirm: true},
      autoFocus: false,
      panelClass: 'bordered-dialog'
    });

    dialogRef.afterClosed().pipe(take(1), switchMap(result => {
      if (result) {
        return this.gameHttpService.applyToGameRequestAsMaster(this.game._id);
      } else {
        return EMPTY;
      }
    })).pipe(take(1)).subscribe((res: IResponseMessage) => {
      if (res.message === 'success' && this.user && this.user.username) {
        this.game.master = {username: this.user.username, avatar: this.user.avatar || '', rate: this.user.rate || 0};
        this.notificationService.openSnackBar('success', 'Ви стали майстром цієї гри');
      }
    });
  }

  openRemoveMasterDialog(): void {
    const text = 'Ви впевнені, що хочете видалити МАЙСТРА цієї гри?';
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {title: 'Видалення майстра', text, withConfirm: true},
      autoFocus: false,
      panelClass: 'bordered-dialog'
    });
    dialogRef.afterClosed().pipe(take(1), switchMap(result => {
      if (result) {
        return this.gameHttpService.removeMasterFromGameRequest(this.game._id);
      } else {
        return EMPTY;
      }
    })).subscribe((res: IResponseMessage) => {
      if (res.message ==='success' && this.user && this.user.username) {
        this.game.master.username = '';
        this.notificationService.openSnackBar('success', 'Ви видалили майстра');
    }})
  }

  search (tag: string) {
    // this.sharedService.searchSubjectSet(tag);
    this.sharedService.tagSearchSubjectSet(tag);
  }

  getShareRoute (): string {
    let user;
    let route;
    if (this.cardType === 'gameRequest') {
      user = this.game.creator.username.replace(/ /ig, '%2520'); //hack for spaces
      route = `${this.websiteUrl}/game-request/${user}/${this.game._id}`
    } else {
      user = this.game.master.username.replace(/ /ig, '%2520'); //hack for spaces
      route = `${this.websiteUrl}/${user}/${this.game._id}`
    }
    return route;
  }

  openShare () {
    if (!this.sharedService.isBrowser) {
      return;
    }
    if (this.isDeviceMobile) {
      navigator.share({
        url: this.getShareRoute(),
        title: this.game.title,
      })
        .then().catch(err => console.log(err));
    }
  }

  share (social: 'telegram' | 'facebook' | 'copy') {
    if (social === 'telegram') {
      this.window.open(`https://telegram.me/share/url?url=${this.getShareRoute()}`);
    }
    if (social === 'facebook') {
      this.window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.getShareRoute()}`);
    }
    if (social === 'copy') {
      this.clipboard.copy(`${this.getShareRoute()}`);
      this.notificationService.openSnackBar('info', 'Скопійовано, тепер надішли це кудись.', 'Ура!')
    }
  }

  createCharacter () {
    this.window.open(`https://dndme.club/`);
  }

  //remove after event
  // allowEventCard (): boolean {
  //   // const today = new Date();
  //   // const eventDate = new Date('July 30, 2023 23:59:59');
  //   // return today < eventDate &&
  // }
}
