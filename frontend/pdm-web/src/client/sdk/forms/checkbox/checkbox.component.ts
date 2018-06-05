/**
 * Usage
        <a3s-checkbox
            *ngSwitchCase="'checkbox'"
            [id]="item.key"
            [formControlName]="item.key"
            [config]="item.config"
            (changedValue)="item.config.setItem($event)">
        </a3s-checkbox>
 */
import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { CheckboxConfigType } from './config/checkbox.type';

// style="margin-top: 8px"
// style="width: 60px; height: 24px"
@Component({
    selector: 'a3s-checkbox',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix">
            <div class="a3-form-text">{{ config.title }} </div>
            <label class="a3-form-textbox">
                <input type="checkbox" 
                        [(ngModel)]="checked" 
                        [checked]="checked"
                        (change)="_handleChange($event)"
                        [ngClass]="config.style"/>
                <select [(ngModel)]="selectedValue" (ngModelChange)="_changeSelect($event)">
                    <option *ngFor="let option of options" [ngValue]="option" [selected]="selected === option">{{ option }}</option>
                </select>
                <span>{{ config.label }}</span>
            </label>
        </div>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CheckboxComponent), multi: true }
    ],
    encapsulation: ViewEncapsulation.None
})
export class CheckboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: CheckboxConfigType;
    @Output() changedValue: EventEmitter<any> = new EventEmitter();

    checked: boolean;
    selected: number;
    selectedValue: number;
    options: [number];

    // for ControlValueAccessor
    propagateChange: any = () => { };

    private _element: HTMLElement;

    constructor(private element: ElementRef) {}

    ngOnInit() {
        this._element = this.element.nativeElement;
        // set config value
        this.checked = this.config.value.checked;
        this.selected = this.config.value.dropdown.selected;
        this.selectedValue = this.selected;
        this.options = this.config.value.dropdown.options;
    }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(isChecked: any) {}

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    _handleChange(event: any) {
        event.stopPropagation();

        const checked = event.target.checked;
        if (this.config.transformItem) {
            const tmp = this.config.transformItem(checked);
            this.checked = tmp;
        } else {
            this.checked = checked;
        }
        this.onChange();
    }

    _changeSelect(event: any) {
        this.onChange();
    }

    onChange() {
        // Propagate Form value
        if (this.propagateChange) {
            this.propagateChange(this.checked);
        }

        // must key, item object
        this.changedValue.emit({
            key: this.config.key,
            item: {
                checked: this.checked,
                dropdown: {
                    selected: this.selectedValue,
                    options: this.options
                }
            }
        });
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
