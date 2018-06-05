import { Directive, EventEmitter, forwardRef, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UIComponent } from './ui-component';
import { Util } from '../utils/utils.module';
import { FormValueChangeType } from './form.type';

export const FORM_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FormComponent),
    multi: true
};

@Directive({
    selector: 'a3s-form-base',
    providers: [FORM_CONTROL_VALUE_ACCESSOR]
})
export class FormComponent extends UIComponent implements ControlValueAccessor {
    _valid: boolean = true;
    _listData: any;
    _focused: boolean;
    _value: any;
    _config: any; //MIFormComponentType;
    _initListData: boolean;

    @Input() form: any;
    @Input() type: string = 'text';
    @Input() name: string;
    @Input() placeholder: string;
    @Input() errorMessage: string;
    // select form
    @Input() initLabel: string;
    @Input() initValue: any;
    @Input() labelField: string = 'label';
    @Input() dataField: string = 'data';
    // checkbox
    @Input() label: string;
    // multiselect
    @Input() disableSelectedBox: boolean;
    // datetime
    @Input() format: any;
    @Input() enableInput: boolean;

    @Input()
    set config(value: any) {
        this._config = value;
    }
    get config() {
        return this._config;
    }

    @Input()
    set listData(value: any) {
        this._listData = value;
        if (this._initListData) {
            this.initComponent();
        }
        this._initListData = true;
    }
    get listData() {
        return this._listData;
    }

    @Input()
    set value(value: any) {
        if (!this.disabled && this._value !== value) {
            this._value = value;
            this.updateViewFromValue();
            this.emitValueChange();
        }
    }
    get value() {
        return this._value;
    }

    get valid() {
        return this.disabled ? true : this._valid;
    }

    @Output() valueChange: EventEmitter<FormValueChangeType> = new EventEmitter<FormValueChangeType>();
    @Output() keyUp: EventEmitter<any> = new EventEmitter<any>();

    constructor() {
        super();
    }

    initComponent() {
        // override
    }

    updateViewFromValue() {
        // override
    }

    emitValueChange() {
        const data = this._getChangeValue();
        this.valueChange.emit(data);
    }

    _getChangeValue(): any {
        const valueItem = Util.Data.findItem(this.listData, this.dataField, this.value);
        const data: FormValueChangeType = {
            target: this,
            value: this.value,
            valueItem: valueItem
        };
        return data;
    }

    /**
     * Event
     */
    onValueChange(e: any) {
        this.value = e.value;
    }

    onFocus(e: any) {
        this._focused = true;
    }

    onBlur(e: any) {
        this._focused = false;
    }

    onKeyUp(e: any) {
        this.value = (<HTMLInputElement>event.target).value;
        this.keyUp.emit(e);
    }

    /**
     * for of ControlValueAccessor
     */
    onChangeCallback: (v: any) => void = () => { };

    writeValue(value: any) {
        if (value !== this._value) {
            this.value = value;
        }
    }

    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any) {
        // empty
    }

    setDisabledState?(isDisabled: boolean) {
        // empty
    }
}
