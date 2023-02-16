import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { cities } from '@app/shared/helpers/cities';
import { imgPattern } from '@app/shared/helpers/regex-patterns';
import { texts } from '@app/shared/helpers/texts';
import { GameHttpService } from '../shared/services/game-http.service';
import { IGamePost, IGameResponse, IGameSystem } from '../shared/models/game.interface';
import { UnsubscribeAbstract } from '../shared/helpers/unsubscribe.abstract';
import { Observable, takeUntil } from 'rxjs';
import { gameSystems } from '@shared/helpers/game-systems';
import { ICity } from '@shared/models/city.interface';

@Component({
  selector: 'app-game-form.wrapper',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  imgPattern = imgPattern;
  texts = texts;
  minDate = new Date(Date.now());
  cities: ICity[] = cities;
  games$: Observable<IGameResponse[]> = this.gameHttpService.fetchGames();
  gameSystems: IGameSystem[] = gameSystems;

  constructor (private fb: FormBuilder, private gameHttpService: GameHttpService) {
    super();
  }

  ngOnInit (): void {
    this.initForm();
  }

  private initForm () {
    this.form = this.fb.group({
      title: [ '', [ Validators.required, Validators.minLength(5), Validators.maxLength(50) ] ],
      description: [ '', [ Validators.required, Validators.minLength(10), Validators.maxLength(2000) ] ],
      tags: [ '', Validators.maxLength(100) ],
      imgUrl: [ null, [ Validators.pattern(this.imgPattern), Validators.maxLength(240) ] ],
      gameSystemId: [ null, [ Validators.required ] ],
      cityCode: [ null, [ Validators.required ] ],
      price: [ 0, [ Validators.required ] ],
      maxPlayers: [ 1, [ Validators.required ] ],
      byInvite: [ false, [ Validators.required ] ],
      startDateTime: [ '', [ Validators.required ] ],
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


  submit () {
    const formValue = this.form.getRawValue();
    const tags = formValue.tags ? formValue.tags.split(',').map((element: string) => element.trim()) : [];
    const checkedTags: string[] = [];
    tags.forEach((el: string) => {
      if (el !== '') {
        checkedTags.push(el);
      }
    });
    formValue.tags = checkedTags;
    console.log(formValue);
    this.gameHttpService.createGame(formValue as IGamePost).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      console.log(res);
    })
  }
}
