/**
 * Usage
 * <a3s-date-range class="a3-date-range"
 *     [cutoffType]="cutoffType"    // DAY | DATE
 *     [dayPeriod]="dayPeriod"
 *     [timePeriod]="timePeriod"
 *     (changedRange)="changedRange($event)"></a3s-date-range>
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
    ViewEncapsulation,
    ChangeDetectionStrategy
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UUIDUtil } from '../../utils/uuid.util';
import { SpecAlarmingConfigType } from './config/spec-alarming.type';

@Component({
    selector: 'a3s-spec-alarming',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix">
        	<div class="a3-form-text">{{ config.title }}</div>
        	<label class="a3-form-textbox">
                <div class="wqp-label-container">
                    <div class="wqp-label-group clearfix">
                    <dl class="wqp-label success">
                        <dt class="label-strong"></dt>
                        <dd class="label-normal"></dd>
                    </dl>
                    <dl class="wqp-label warning">
                        <dt class="label-strong"></dt>
                        <dd class="label-normal"></dd>
                    </dl>
                    <dl class="wqp-label danger">
                        <dt class="label-strong"></dt>
                        <dd class="label-normal"></dd>
                    </dl>
                    <ul class="wqp-label-input">
                        <li class="value01">0</li>
                        <li class="value02 form-group">
                            <input type="text" class="form-control" id="ucl" 
                                [(ngModel)]="spec.ucl" 
                                (blur)="_handleUclBlur($event.target.value)"
                                (change)="_handleUclChange($event.target.value)"
                                placeholder="value">
                        </li>
                        <li class="value03 form-group">
                            <input type="text" class="form-control" id="usl" 
                                [(ngModel)]="spec.usl" 
                                (blur)="_handleUslBlur($event.target.value)"
                                (change)="_handleUslChange($event.target.value)"
                                placeholder="value">
                        </li>
                        <li class="value04"></li>
                    </ul>
                    </div>
                </div>
            </label>
        </div>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SpecAlarmingComponent), multi: true }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class SpecAlarmingComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: SpecAlarmingConfigType;
    @Output() changedSpec: EventEmitter<any> = new EventEmitter();

    spec: any = {};
    specAlarmingId: string;
    // for ControlValueAccessor
    propagateChange: any = () => { };

    private _element: HTMLElement;

    constructor(private element: ElementRef) {
        this.specAlarmingId = `spec-alarming-${UUIDUtil.new()}`;
    }

    ngOnInit() {
        this._element = this.element.nativeElement;
        // set config value
        this.spec = this.config.spec;
    }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(value: any) {
        if (value) {

        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() { }

    /**
     * mouse input change
     */
    _handleUclBlur(ucl) {
        this.spec.ucl = parseFloat(parseFloat(ucl).toFixed(6));
        this.onChange();
    }

    _handleUclChange(ucl) {
        this.spec.ucl = parseFloat(parseFloat(ucl).toFixed(6));
        this.onChange();
    }

    _handleUslBlur(usl) {
        this.spec.usl = parseFloat(parseFloat(usl).toFixed(6));
        this.onChange();
    }

    _handleUslChange(usl) {
        this.spec.usl = parseFloat(parseFloat(usl).toFixed(6));
        this.onChange();
    }

    onChange() {
        console.log('spec-alarming :: onChange');
        
        // Propagate Form value
        if (this.propagateChange) {
            this.propagateChange(this.spec);
        }

        // must key, item object
        this.changedSpec.emit({
            key: this.config.key,
            item: this.spec
        });
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
