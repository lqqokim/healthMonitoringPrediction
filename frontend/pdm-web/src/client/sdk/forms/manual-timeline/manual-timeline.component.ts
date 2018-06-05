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
import { ManualTimelineConfigType } from './config/manual-timeline.type';
import { Util } from "../../utils/utils.module";

@Component({
    selector: 'a3s-manual-timeline',
    template: `
        <div class="a3-configuration-forms-wrapper clearfix">
            <div class="a3-form-text">{{config.title}}</div>
            <div class="a3-form-timeline">
                <div class="radio lastest">
                    <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option1"
                               [checked]="mode == CONFIG.WIDGET.TIME_LINE.NOW"
                               (click)="changeDateMode(CONFIG.WIDGET.TIME_LINE.NOW)">
                        Latest
                    </label>
                </div>
                <div class="radio user-define">
                    <label>
                        <input type="radio" name="optionsRadios" id="optionsRadios1" value="option2s"
                               [checked]="mode == CONFIG.WIDGET.TIME_LINE.MANUAL"
                               (click)="changeDateMode(CONFIG.WIDGET.TIME_LINE.MANUAL)">
                        User Define
                    </label>
                    <span class="systme-specified-group" *ngIf="mode == CONFIG.WIDGET.TIME_LINE.MANUAL">
                        <span class="systme-specified">System specified ~</span> 
                        <div class="input-group date input-append a3-datetime-picker"
                             [date]="selectedDate"
                             (changedDate)="changeDate($event)">
                        </div>
                    </span>
                </div>
            </div>
        </div>
    `,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => ManualTimelineComponent), multi: true}
    ],
    encapsulation: ViewEncapsulation.None
})
export class ManualTimelineComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() config: ManualTimelineConfigType;
    @Output() changedValue: EventEmitter<any> = new EventEmitter();

    CONFIG: any = A3_CODE;
    selectedDate: number;
    options: [number];
    mode: string;

    // for ControlValueAccessor
    propagateChange: any = () => {};

    private _element: HTMLElement;

    constructor(private element: ElementRef) {}

    ngOnInit() {
        this._element = this.element.nativeElement;
        this.selectedDate = this.config.value;
        this.mode = this.selectedDate ? A3_CODE.WIDGET.TIME_LINE.MANUAL : A3_CODE.WIDGET.TIME_LINE.NOW;
    }

    /**
     * implement ControlValueAccessor interface
     */
    writeValue(isChecked: any) {}

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched() {}

    changeDate(event) {
        if (this.propagateChange) {
            this.propagateChange(event.datetime);
        }
        if (this.mode === A3_CODE.WIDGET.TIME_LINE.MANUAL) {
            this.selectedDate = event.datetime;
        }
        this.changedValue.emit({
            key: this.config.key,
            item: event.datetime
        });
    }

    changeDateMode(mode: string) {
        this.mode = mode;
        const selectedDate = this.selectedDate ? this.selectedDate : Util.Date.now();
        const datetime = mode === A3_CODE.WIDGET.TIME_LINE.NOW ? null : selectedDate;
        this.changeDate({datetime: datetime});
        // this.selectedDate = mode === A3_CODE.WIDGET.TIME_LINE.NOW ? null : Util.Date.now();
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

}
