import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { cities } from '@app/shared/helpers/cities';
import { imgPattern } from '@app/shared/helpers/regex-patterns';
import { texts } from '@app/shared/helpers/texts';
import { GameHttpService } from '../shared/services/game-http.service';
import { IGamePost, IGameResponse, IGameSystem } from '../shared/models/game.interface';
import { UnsubscribeAbstract } from '../shared/helpers/unsubscribe.abstract';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { gameSystems } from '@shared/helpers/game-systems';
import { ICity } from '@shared/models/city.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../shared/services/notification.service';
import { environment } from '@environment/environment';
import { MetaHelper } from '@shared/helpers/meta.helper';

@Component({
  selector: 'app-game-form.content',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  imgPattern = imgPattern;
  texts = texts;
  minDate = new Date(Date.now());
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;
  editing = false;
  game?: IGameResponse;
  postingText = '';
  isShowBooked = false;

  constructor (
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private gameHttpService: GameHttpService,
    private notificationService: NotificationService,
    private router: Router,
    private metaHelper: MetaHelper
    ) {
    super();
  }

  ngOnInit (): void {
    this.initForm();
    this.checkRoute();
    this.trackFormChanges();
  }

  private checkRoute() {
    if (this.route.snapshot.params['master'] && this.route.snapshot.params['id']) {
      this.gameHttpService.fetchGameById(this.route.snapshot.params['id'], true).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: IGameResponse) => {
        this.game = res;
        if (this.game.master.username === this.route.snapshot.params['master']) {
          this.editing = true;
        }
        this.form.patchValue(res);
        (res?.tags && res?.tags.length) ? this.formTags.patchValue(res?.tags.toString()) : this.formTags.patchValue('');
        if (res?.booked && res?.booked.length) {
          this.isShowBooked = true;
          res.booked.forEach((el: string, index: number) => {
            this.formBookedTelegramIndex(index)?.patchValue(el);
          })
        }
        this.form.updateValueAndValidity();
      })
      this.updateMeta()
      return;
    }
  }
  private updateMeta () {
    this.metaHelper.updateMeta({
      title: this.editing ? 'Редагувати гру' : 'Створити гру',
      tags: [this.editing ? 'Редагування гри' : 'Створення гри'],
      text: this.editing ? 'Онови або зміни свою гру на ЕНЕРІ' : 'Створи нову гру та знайти гравців на ЕНЕРІ',
      type: 'article',
      url: this.editing ? `${environment.url}/edit-game/${this.game?.master.username}/${this.game?._id}` : `${environment.url}/create-game`
    });
  }

  private initForm (game: IGameResponse | undefined = undefined) {
    this.form = this.fb.group({
      title: [ game?.title || '', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ] ],
      description: [ game?.description || '', [ Validators.required, Validators.minLength(10), Validators.maxLength(2000) ] ],
      tags: [ (game?.tags && game?.tags.length) ? game?.tags.toString() : '', Validators.maxLength(100) ],
      imgUrl: [ game?.imgUrl || null, [ Validators.pattern(this.imgPattern), Validators.maxLength(240) ] ],
      gameSystemId: [ (game?.gameSystemId || game?.gameSystemId === 0) ? game?.gameSystemId : null, [ Validators.required ] ],
      cityCode: [ (game?.cityCode || game?.cityCode === 0) ? game?.cityCode : null, [ Validators.required ] ],
      price: [ game?.price || 0, [ Validators.required ] ],
      maxPlayers: [ game?.maxPlayers || 1, [ Validators.required ] ],
      byInvite: [ false, [ Validators.required ] ],
      startDateTime: [ game?.startDateTime || '', [ Validators.required ] ],
      booked: this.fb.array([this.formBookedGroup()])
    });
  }
  get formTitle () {
    return this.form.get('title') as FormControl;
  }
  get formDescription () {
    return this.form.get('description') as FormControl;
  }
  get formTags () {
    return this.form.get('tags') as FormControl;
  }
  get formImgUrl () {
    return this.form.get('imgUrl') as FormControl;
  }
  get formGameSystemId () {
    return this.form.get('gameSystemId') as FormControl;
  }
  get formCityCode () {
    return this.form.get('cityCode') as FormControl;
  }
  get formPrice () {
    return this.form.get('price') as FormControl;
  }
  get formMaxPlayers () {
    return this.form.get('maxPlayers') as FormControl;
  }
  get formByInvite () {
    return this.form.get('byInvite') as FormControl;
  }
  get formStartDateTime () {
    return this.form.get('startDateTime') as FormControl;
  }
  get formBooked (): FormArray {
    return this.form.get('booked') as FormArray;
  }
  formBookedIndex (index: number) {
    return this.formBooked.controls[index];
  }
  formBookedTelegramIndex(index: number) {
    return this.formBookedIndex(index)?.get('userTelegram');
  }
  formBookedGroup() {
    return this.fb.group({
      userTelegram: ['', [ Validators.minLength(3), Validators.maxLength(30) ]],
    });
  }

  trackFormChanges() {
    this.formMaxPlayers.valueChanges.pipe(takeUntil(this.ngUnsubscribe$), debounceTime(100), distinctUntilChanged())
      .subscribe(res => {
        if ((this.formBooked.value.length + (this.game?.players?.length || 0)) < res) {
          const amount = res - (this.formBooked.value.length + (this.game?.players?.length || 0));
          for (let i = 0; i < amount; i++) {
            this.formBooked.push(this.formBookedGroup())
          }
        }
        if ((this.formBooked.value.length + (this.game?.players?.length || 0)) > res) {
          const amount = (this.formBooked.value.length  + (this.game?.players?.length || 0)) - res;
          for (let i = 0; i < amount; i++) {
            this.formBooked.removeAt(this.formBooked.value.length - 1);
          }
        }
      })
  }


  submit () {
    if (this.form.invalid) {
      return
    }
    this.postingText = 'Зачекайте...';
    const formValue = this.form.getRawValue();
    if (!this.isShowBooked) {
      formValue.booked = []
    } else {
      formValue.booked = [];
      this.form.getRawValue().booked.forEach((el: {userTelegram: string}) => {
        el.userTelegram ? formValue.booked.push(el.userTelegram) : null
      })
    }
    const tags = formValue.tags ? formValue.tags.split(',').map((element: string) => element.trim()) : [];
    const checkedTags: string[] = [];
    tags.forEach((el: string) => {
      if (el !== '') {
        checkedTags.push(el);
      }
    });
    formValue.tags = checkedTags;

    if (this.editing && this.game) {
      this.gameHttpService.updateGame(formValue as IGamePost, this.game._id).pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(res => {
          this.postingText = 'Редаговано'
          if (res) {
            this.notificationService.openSnackBar('success', 'Вдало редаговано');
            this.router.navigate([`/${this.game?.master.username}/${this.game?._id}`]);
          }
      })
      return;
    }
    this.gameHttpService.createGame(formValue as IGamePost).pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(res => {
        this.postingText = 'Створено'
        if (res) {
          this.notificationService.openSnackBar('success', 'Вдало створено');
          this.router.navigate([`/${res.master.username}/${res._id}`]);
        }
    })
  }

  changeBooking () {
    this.isShowBooked = !this.isShowBooked;
  }
}
