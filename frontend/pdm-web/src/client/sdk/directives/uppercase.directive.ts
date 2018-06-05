import { Directive, ElementRef } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[ngModel][a3-uppercase]',
    host: {
        // '(keyup)': 'onKeyup($event)',
        '(blur)': 'execute($event)',
        '(keydown)': 'onKeydown($event)'
    }
})
export class UppercaseDirective {
    constructor(private ngModel: NgModel) {}

    onKeydown(event: any) {
        if (event && event.which === 13) {
            this.execute(event);
        }
    }

    onKeyup(event: any) {
        if (event && event.target && event.target.value) {
            setTimeout(() => {
                event.target.value = event.target.value.toUpperCase();
            }, 50);
        }
    }



    execute(event: any) {
        if (event && event.target && event.target.value) {
            event.target.value = event.target.value.toUpperCase();
            if (this.ngModel) {
                this.ngModel.update.emit(event.target.value);
            }
        }
    }
}
