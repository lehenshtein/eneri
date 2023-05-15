import { Component } from '@angular/core';
import { MetaHelper } from '@shared/helpers/meta.helper';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-about.content',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent {
  constructor (private metaHelper: MetaHelper) {
    this.updateMeta();
  }

  private updateMeta () {
    this.metaHelper.updateMeta({
      title: 'Про ЕНЕРІ',
      tags: ['НРІ', 'Про нас', 'ДнД', 'D&D', 'Dungeons&Dragons', 'Підземелля і Дракони', 'Настільні рольові ігри'],
      text: 'Українська платформа для пошуку настільних рольових ігор у твоєму місті',
      type: 'article',
      url: `${environment.url}/about`
    });
  }

}
