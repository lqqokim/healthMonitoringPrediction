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
    EventEmitter,
    forwardRef,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { UUIDUtil } from '../../utils/uuid.util';
import { DateUtil } from '../../utils/date.util';

import { DateRangeConfigType } from './config/date-range.type';

@Component({
    selector: 'a3s-date-range',
    template: `
        <div [id]="dateRangeId">
            <div class="a3-configuration-forms-wrapper clearfix" style="margin-bottom: 2px !important">
                <div class="a3-form-text">&nbsp;</div>
                <label class="configuration-radio-wrapper" for="rb-period">
                    <input type="radio" class="configuration-radio" name="period" value="DAY" *ngIf="isTimePeriod" 
                           [(ngModel)]="cutoffType" 
                           (ngModelChange)="onChange()" id="rb-period" />
                    <span>Previous</span>
                    <input #dayPeriodEl type="text"
                    	   class="a3-config-text-box"
                           [value]="dayPeriod"
                           (change)="dayPeriodChange($event, dayPeriodEl.value)"
                           [disabled]="cutoffType !== 'DAY'" id="" />
                    <span>day(s)</span>
                </label>
            </div>
            <div class="a3-configuration-forms-wrapper clearfix" *ngIf="isTimePeriod">
                <div class="a3-form-text">&nbsp;</div>
                <label for="rb-date" class="configuration-radio-wrapper">
                    <input type="radio" class="configuration-radio" name="period" value="DATE" 
                           [(ngModel)]="cutoffType" 
                           (ngModelChange)="onChange()" id="rb-date" />
                    <span>Date Range</span> 
                </label>
                <div class="a3-from-to" 
                [from]="timePeriod?.from" 
                [to]="timePeriod?.to"
                [format]="format"
                (changedFromTo)="fromToChange($event)">
            </div>
            </div>
        </div>
    `,
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangeComponent), multi: true }
    ],
    encapsulation: ViewEncapsulation.None
})
export class DateRangeComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: DateRangeConfigType;
    @Output() changedRange: EventEmitter<any> = new EventEmitter();

    cutoffType: string;
    dayPeriod: number;
    timePeriod: any;
    dateRangeId: string;
    isTimePeriod = true;
    format: string;

    private _element: HTMLElement;

    constructor(private element: ElementRef) {
        this.dateRangeId = `date-range-${UUIDUtil.new()}`;
    }

    // for ControlValueAccessor
    // tslint:disable-next-line:no-empty
    propagateChange: any = () => { };

    ngOnInit() {
        this._element = this.element.nativeElement;
        // set config value 
        this.cutoffType = this.config.cutoffType;
        this.dayPeriod = this.config.dayPeriod;
        this.timePeriod = this.config.timePeriod;
        this.isTimePeriod = this.config.isTimePeriod === false ? this.config.isTimePeriod : true;
        this.format = this.config.format ? this.config.format : 'MM/dd/yyyy hh:mm:ss';
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

    // tslint:disable-next-line:no-empty
    registerOnTouched() { }

    dayPeriodChange($event: any, dayPeriod: number) {
        if (isNaN(dayPeriod) || dayPeriod <= 0) {
            $event.target.value = this.dayPeriod;
        } else {
            this.dayPeriod = +dayPeriod;
        }

        this.onChange();
    }

    fromToChange($event: any) {
        this.timePeriod.from = $event.from;
        this.timePeriod.to = $event.to;

        this.onChange();
    }

    onChange() {
        // DAY이면 timePeriod에 from to를 설정해준다. 애플리케이션에서는 from, to만 사용함. 
        let timePeriod: any;
        if (this.cutoffType === 'DAY') {
            const now = DateUtil.now();
            timePeriod = {
                from: DateUtil.getFrom(this.dayPeriod, now),
                to: now
            };
        } else {
            timePeriod = this.timePeriod;
        }

        const event = {
            cutoffType: this.cutoffType,
            dayPeriod: this.dayPeriod,
            timePeriod: timePeriod
        };

        // Propagate Form value 
        if (this.propagateChange) {
            this.propagateChange(event);
        }

        // must key, item object 
        this.changedRange.emit({
            key: this.config.key,
            item: event
        });
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
