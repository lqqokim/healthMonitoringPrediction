/**
 * Usage
        <a3s-textbox
            *ngSwitchCase="'textbox'"
            [id]="item.key"
            [formControlName]="item.key" 
            [config]="item.config"
            (changedValue)="item.config.setItem($event)">
        </a3s-textbox>
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

import { TextboxConfigType } from './config/textbox.type';

@Component({
    selector: 'a3s-textbox',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix">
            <div class="a3-form-text">{{ config.title }} </div>
            <label class="a3-form-textbox">
                <input type="text" 
                        [(ngModel)]="value" 
                        (blur)="_handleBlur($event)"
                        (change)="_handleChange($event)"
                        [ngClass]="config.style"
                        [placeholder]="config.placeholder"/>
                <span>{{ config.unit }}</span>
            </label>
        </div>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextboxComponent), multi: true }
    ],
    encapsulation: ViewEncapsulation.None
})
export class TextboxComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: TextboxConfigType;
    @Output() changedValue: EventEmitter<any> = new EventEmitter();
    
    value: any;
    beforeValue: any;
    // for ControlValueAccessor
    propagateChange: any = () => { };

    private _element: HTMLElement;

    constructor(private element: ElementRef) {
    }
    
    ngOnInit() {
        this._element = this.element.nativeElement;
        // set config value 
        this.value = this.config.value;
        this.beforeValue = this.config.value;
    }

    /**
     * implement ControlValueAccessor interface 
     */
    writeValue(value: any) {
        if (value) {
            console.log('---writeValue:', value);
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    /**
     * mouse input change 
     */
    _handleBlur(event: any) {
        event.stopPropagation();
        
        const value = event.target.value;
        if (this.config.transformItem) {
            const tmp = this.config.transformItem(value);
            if (!isNaN(tmp)) {
                this.value = tmp;
                this.beforeValue = tmp;
            } else {
                this.value = this.beforeValue;
            }
        } else { 
            this.value = value;
            this.beforeValue = value;
        }
        this.onChange();
    }

    _handleChange(event: any) {
        event.stopPropagation();
        
        const value = event.target.value;
        if (this.config.transformItem) {
            const tmp = this.config.transformItem(value);
            if (!isNaN(tmp)) {
                this.value = tmp;
                this.beforeValue = tmp;
            } else {
                this.value = this.beforeValue;
            }
        } else { 
            this.value = value;
            this.beforeValue = value;
        }
        this.onChange();
    }

    onChange() {
        // Propagate Form value 
        if (this.propagateChange) {
            this.propagateChange(this.value);
        }

        // must key, item object 
        this.changedValue.emit({
            key: this.config.key,
            item: this.value
        });
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
