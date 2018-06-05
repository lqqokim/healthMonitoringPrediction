import { Injectable } from '@angular/core';

import { TranslateService } from "ng2-translate";

@Injectable()
export class TranslaterService {

	_lang: string = 'locale-en';

	constructor(private translate: TranslateService) {
		this._init();
	}

	private _init(): void {
		this._lang = this._getLang();
		// this language will be used as a fallback when a translation isn't found in the current language
		this.translate.setDefaultLang(this._lang);
		// the lang to use, if the lang isn't available, it will use the current loader to get them
		this.translate.use(this._lang);
	}

	private _getLang(): string {
		let browserLang: string = this.translate.getBrowserLang();
        let defaultLocale: string = 'locale-en';
		switch (browserLang) {
			case 'en': return 'locale-en';
			case 'ko': return 'locale-ko';
			default: return defaultLocale;
		}
	}
}
