import { Meta, Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

export interface MetaInterface {
  title: string,
  text: string,
  type: string,
  url: string,
  imgUrl?: string,
  tags: string[],
  author?: string
}

@Injectable({
  providedIn: 'root'
})
export class MetaHelper {

  constructor (private meta: Meta, private title: Title) {
  }
  resetTitle(){
    this.title.setTitle('ЕНЕРІ');
  }

  updateTitle(title: string){
    this.title.setTitle(title);
  }

  resetMeta () {
    this.resetTitle();
    this.meta.updateTag({property: 'og:title', content: 'ЕНЕРІ'});
    this.meta.updateTag({name: 'twitter:title', content: 'ЕНЕРІ'});

    this.meta.updateTag({name: 'author', content: 'LehenShtein'});
    this.meta.updateTag({name: 'twitter:creator', content: '@LehenShtein'});

    this.meta.updateTag({name: 'keywords', content: 'НРІ, настільні рольові ігри, настільні ігри, підземелля та дракони, днд, DnD, D&D, dungeons and dragons, розваги'});

    const description = 'Перший централізований портал для пошуку та запису на настільні рольові ігри в Україні';
    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({name: 'twitter:description', content: description});

    this.meta.updateTag({property: 'og:type', content: 'website'});

    this.meta.updateTag({property: 'og:url', content: 'https://eneri.com.ua/'});

    const defaultImg = 'https://eneri.com.ua/assets/images/eneri-social.jpg';
    this.meta.updateTag({property: 'og:image', content: defaultImg});
    this.meta.updateTag({property: 'og:image:secure_url', content: defaultImg});
    this.meta.updateTag({name: 'twitter:image', content: defaultImg});
  }

  updateMeta (options: MetaInterface) {
    const title = (`ЕНЕРІ | Майстер: ${options.author} | Гра: ${options.title} `).slice(0, 70);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({name: 'twitter:title', content: title});
    this.updateTitle(title);

    const author = options.author || 'LehenShtein'
    this.meta.updateTag({name: 'author', content: author});
    this.meta.updateTag({name: 'twitter:creator', content: '@'+author});

    if (options.tags && options.tags.length) {
      let keywords = '';
      options.tags.forEach(tag => {
        keywords += tag + ',';
      })
      keywords = keywords.substring(0, keywords.length - 1)
      this.meta.updateTag({name: 'keywords', content: keywords});
    }

    let description = options.text ? options.text.slice(0, 150) : '';
    let img = options.imgUrl;

    // if (options.content && options.content.length) {
    //   let firstImg = '';
    //   let firstText = '';
    //   options.content.forEach(content => {
    //     if (firstImg && firstText) {
    //       return;
    //     } else if (content.type === 'text' && !firstText && content.text) {
    //       firstText = content.text
    //     } else if (content.type === 'imgUrl' && !firstImg && content.imgUrl) {
    //       firstImg = content.imgUrl
    //     }
    //   })
    //
    //   if (firstImg) {
    //     img = firstImg;
    //   }
    //
    //   if (firstText) {
    //     description = firstText ? firstText.slice(0, 150) : '';
    //   }
    // }

    this.meta.updateTag({name: 'description', content: description});
    this.meta.updateTag({property: 'og:description', content: description});
    this.meta.updateTag({name: 'twitter:description', content: description});

    this.meta.updateTag({property: 'og:type', content: options.type});

    this.meta.updateTag({property: 'og:url', content: options.url.replace(/ /ig, '%20')});

    if (img) {
      this.meta.updateTag({property: 'og:image:url', content: img});
      this.meta.updateTag({property: 'og:image:secure_url', content: img});
      this.meta.updateTag({name: 'twitter:image', content: img});
    }
  }
}
