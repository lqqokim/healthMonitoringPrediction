import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { SelectorConfigType } from './config/selector.type';

@Component({
    selector: 'a3s-selector',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix">
            <div class="a3-form-text">{{config.title}}</div>
            <div class="btn-group">
                <select [(ngModel)]="selected" (ngModelChange)="changeSelect($event)">
                    <option *ngFor="let option of options" [ngValue]="option.data" [selected]="selected === option.data">{{option.label}}</option>
                </select>
                <span>{{config.behindLabel}}</span>
            </div>
        </div>
    `,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectorComponent), multi: true}
    ],
    encapsulation: ViewEncapsulation.None
})
export class SelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: SelectorConfigType;
    @Output() changedValue: EventEmitter<any> = new EventEmitter();

    selected: any;
    selectedValue: number;
    options: any;

    // for ControlValueAccessor
    propagateChange: any = () => { };

    private _element: HTMLElement;

    constructor(private element: ElementRef) {}

    ngOnInit() {
        this._element = this.element.nativeElement;
        this.options = this.config.value.options;
        this.selected = this.config.value.selected;
    }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(isChecked: any) {}

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    changeSelect(event) {
        // Propagate Form value
        if (this.propagateChange) {
            this.propagateChange(event);
        }

        // must key, item object
        this.changedValue.emit({
            key: this.config.key,
            item: event
        });
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
