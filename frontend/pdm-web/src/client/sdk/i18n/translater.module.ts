import { NgModule } from '@angular/core';
import { Http } from "@angular/http";

import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from "ng2-translate";

import { TranslaterService } from "./translater.service";
import { Translater } from "./translater";

/**
 * Must export function style 
 * @see https://github.com/ocombe/ng2-translate/blob/master/README.md
 */
export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '<%=I18N_PREFIX%>', '<%=I18N_SUFFIX%>');
}

@NgModule({
	imports: [
		TranslateModule.forRoot({
			provide: TranslateLoader,
			useFactory: (createTranslateLoader),
			deps: [Http]
		})
	],
	exports: [TranslateModule]
})
export class TranslaterModule {
	static forProviders(): any[] {
		return [
			TranslaterService,
			Translater
		];
	}
}
