import { Component } from '@angular/core';

@Component({
  selector: 'app-partners-dialog',
  templateUrl: './partners-dialog.component.html',
  styleUrls: ['./partners-dialog.component.scss']
})
export class PartnersDialogComponent {
  data = [
    {
      img: 'memologist.jpg',
      title: 'Мемолог',
      text: 'Український розважальний портал. За гарним настроєм та свіжими мемчиками - сюди.',
      link: 'https://memologist.com.ua/new'
    },
    {
      img: 'catsAndDice.jpg',
      title: 'Cats&Dice',
      text: 'НРІ спільнота. Ділимось фото домашніх тварин, просто спілкуємось і підтримуємо один одного. А ще іноді збираємось на офлайн мітапи.',
      link: 'https://t.me/cats_and_dice'
    },
    {
      img: 'diceandbones.jpg',
      title: 'Dice&Bones',
      text: 'Друзі-ґіки та фанати настільних рольових ігор, зокрема Dungeons&Dragons, котрі ще й ведуть своє шоу.',
      link: 'https://linktr.ee/diceandbonesdnd'
    },
    {
      img: 'roleplayUa.jpg',
      title: 'Roleplay Солов\'їною',
      text: 'Місце для рольових ігор онлайн.',
      link: 'https://discord.gg/yAAGnZes6j'
    },
    {
      img: 'larp.jpg',
      title: 'LARP Empire',
      text: 'Клуб настільних ігор та НРІ у Києві.',
      link: 'https://t.me/larpempireUA'
    },
    {
      img: 'grighammer.jpg',
      title: 'Grighammer',
      text: 'Канал про вархаммер та настільні рольові ігри.',
      link: 'https://t.me/grighammer'
    },
    {
      img: 'geekMemes.jpg',
      title: 'Geek Memes',
      text: 'Меми про ігри, серіали та кіно.',
      link: 'https://t.me/zloygik'
    },
    {
      img: 'dndmeIcon.jpg',
      title: 'dndme',
      text: 'Створи персонажа для ДнД за кілька простих кроків.',
      link: 'https://dndme.club/'
    },
    {
      img: 'inriumIcon.jpg',
      title: 'Інріум',
      text: 'Найбільша НРІ спільнота України.',
      link: 'https://t.me/dnd_ua'
    },
  ]
}
