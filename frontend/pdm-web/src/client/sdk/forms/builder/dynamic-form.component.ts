import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormControlBase } from './form-control-base';

@Component({
    moduleId: module.id,
    selector: 'div[a3s-dynamic-form]',
    templateUrl: 'dynamic-form.html',
    host: {
        'style': 'margin-bottom: 15px'
    }
})
export class DynamicFormComponent implements OnInit {

    @Input() item: FormControlBase<any>;
    @Input() form: FormGroup;

    private _invalidMessage: string = '';

    ngOnInit() {}

    get isValid() {
        const form = this.form.controls[this.item.key];

        // console.log('DynamicFormComponent isValid ::', form);
        if (this.item.config && this.item.config.validator) {
            // 환경설정의 validator를 사용 
            const checkedValid = this.item.config.validator(form);
            if (checkedValid === null) {
                return true;
            } else {
                this._invalidMessage = checkedValid.invalidMessage;
                return false;
            }
        } else {
            return this.form.controls[this.item.key].valid;
        }
    }

    get invalidMessage() {
        return this._invalidMessage;
    }

}