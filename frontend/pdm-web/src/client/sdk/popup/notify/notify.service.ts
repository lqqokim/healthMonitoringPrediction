import { Injectable } from '@angular/core';
import { Translater } from '../../i18n/translater';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class NotifyService {

    constructor(
        private translater: Translater,
        private toastyService: ToastyService
    ) {}

    success(msg: string, msgParams?: any) {
        this._translate('success', msg, msgParams);
    }

    info(msg: string, msgParams?: any) {
        this._translate('info', msg, msgParams);
    }

    warn(msg: string, msgParams?: any) {
        this._translate('warn', msg, msgParams);
    }

    error(msg: string, msgParams?: any) {
        this._translate('error', msg, msgParams);
    }

    _translate(type: string, msg: string, msgParams?: any) {
        this.translater.get(msg, msgParams).subscribe((translatedMsg) => {
            this._notify(type, translatedMsg);
        });
    }

    _notify(type: string, msg: string) {
        const toastOptions: ToastOptions = {
            title: '',
            msg: msg,
            showClose: true,
            timeout: 3000,
            theme: 'bootstrap',
            onAdd: (toast: ToastData) => {
                //console.log('Toast ' + toast.id + ' has been added!');
            },
            onRemove: function(toast: ToastData) {
                //console.log('Toast ' + toast.id + ' has been removed!');
            }
        };

        if (type === 'success') {
            this.toastyService.success(toastOptions);
        } else if (type === 'info') {
            this.toastyService.info(toastOptions);
        } else if (type === 'warn') {
            this.toastyService.warning(toastOptions);
        } else if (type === 'error') {
            this.toastyService.error(toastOptions);
        }
    }
}
