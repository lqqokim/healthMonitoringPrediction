import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from 'ng2-translate';

@Injectable()
export class Translater {
    
    constructor(private ts: TranslateService) {}

    setDefaultLang(lang: string): void {
        this.ts.setDefaultLang(lang);
    }

    /**
     * Changes the lang currently used
     * @param lang
     * @returns {Observable<*>}
     */
    use(lang: string): Observable<any> {
        return this.ts.use(lang);
    }
    /**
     * Gets an object of translations for a given language with the current loader
     * @param lang
     * @returns {Observable<*>}
     */
    getTranslation(lang: string): Observable<any> {
        return this.ts.getTranslation(lang);
    }

    /**
     * Manually sets an object of translations for a given language
     * @param lang
     * @param translations
     * @param shouldMerge
     */
    setTranslation(lang: string, translations: Object, shouldMerge?: boolean): void {
        this.ts.setTranslation(lang, translations, shouldMerge);
    }

    /**
     * Returns an array of currently available langs
     * @returns {any}
     */
    getLangs(): Array<string> {
        return this.ts.getLangs();
    }

    /**
     * @param langs
     * Add available langs
     */
    addLangs(langs: Array<string>): void {
        this.ts.addLangs(langs);
    }

    /**
     * Gets the translated value of a key (or an array of keys)
     * @param key
     * @param interpolateParams
     * @returns {any} the translated key, or an object of translated keys
     */
    get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
        return this.ts.get(key, interpolateParams);
    }

    /**
     * Returns a translation instantly from the internal state of loaded translation.
     * All rules regarding the current language, the preferred language of even fallback languages will be used except any promise handling.
     * @param key
     * @param interpolateParams
     * @returns {string}
     */
    instant(key: string | Array<string>, interpolateParams?: Object): string | any {
        return this.ts.instant(key, interpolateParams);
    }

    /**
     * Sets the translated value of a key
     * @param key
     * @param value
     * @param lang
     */
    set(key: string, value: string, lang?: string): void {
        this.ts.set(key, value, lang);
    }
    
    /**
     * Allows to reload the lang file from the file
     * @param lang
     * @returns {Observable<any>}
     */
    reloadLang(lang: string): Observable<any> {
        return this.ts.reloadLang(lang);
    }

    /**
     * Deletes inner translation
     * @param lang
     */
    resetLang(lang: string): void {
        this.ts.resetLang(lang);
    }

    getBrowserLang(): string {
        return this.ts.getBrowserLang();
    }
}
