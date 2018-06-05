/**
 usage
 <datetime-picker [date]="<date>" (changedDate)="<yourMethod>($event)"
 [startDate]="<startdate>" [endDate]="<enddate>"/>
 */

import {
    Component,
    ElementRef,
    OnInit,
    OnChanges,
    OnDestroy,
    Input,
    Output,
    SimpleChanges,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';

import { UUIDUtil } from '../../../utils/uuid.util';

@Component({
    selector: 'div.input-group.date.input-append.a3-datetime-picker, div.a3-datetime-picker',
    template: `
        <input type="text" class="form-control a3-datetime-input" disabled />
        <span class="input-group-addon add-on a3-datetime-calendar">
            <i data-time-icon="glyphicon glyphicon-time" data-date-icon="fa fa-calendar" class="fa fa-calendar"></i>
        </span>
    `,
    encapsulation: ViewEncapsulation.None
})
export class DatetimePickerComponent implements OnInit, OnChanges, OnDestroy {

    protected uuid: string;
    protected datetimepicker: any;
    protected datetime: string;

    @Input() date: any = Date.now();
    @Input() startDate: any;
    @Input() endDate: any;
    @Input() format: any;
    @Output() changedDate: EventEmitter<any> = new EventEmitter();

    private _element: HTMLElement;
    private _id: any;

    constructor(private element: ElementRef) {}

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if ( changes['date'] !== undefined && changes['date'].isFirstChange() ) {
            this._init();
        } else if (changes['date'] !== undefined) {
            if((!this.startDate || this.startDate < changes['date'].currentValue) &&
                (!this.endDate || this.endDate > changes['date'].currentValue)) {
                this.datetimepicker.setLocalDate(new Date(+changes['date'].currentValue));
            } else {
                this.datetimepicker.setLocalDate(new Date(+changes['date'].previousValue));
                this.date = changes['date'].previousValue;
            }
        }

        if (changes['startDate'] !== undefined) {
            if(this.date > changes['startDate'].currentValue) {
                this.datetimepicker.setStartDate(new Date(+changes['startDate'].currentValue));
            } else if (!changes['startDate'].isFirstChange()) {
                this.datetimepicker.setStartDate(new Date(+changes['startDate'].previousValue));
                this.startDate = changes['startDate'].previousValue;
            }
        }

        if (changes['endDate'] !== undefined) {
            if(this.date < changes['endDate'].currentValue) {
                this.datetimepicker.setEndDate(new Date(+changes['endDate'].currentValue));
            } else if (!changes['endDate'].isFirstChange()) {
                this.datetimepicker.setEndDate(new Date(+changes['endDate'].previousValue));
                this.endDate = changes['endDate'].previousValue;
            }
        }
    }

    ngOnDestroy() {
        this._destroy();
    }

    private _init() {
        this._element = this.element.nativeElement;
        this._id = this._element.getAttribute('id');

        this._setIdAttribute();

        this.datetimepicker = $(this._element).datetimepicker({
            //language: 'pt-BR',
            // collapse: false,
            format: this.format || 'MM/dd/yyyy hh:mm:ss',
            language: 'en',
            use24hours: true
        });
        let date = new Date(+this.date);
        this.datetimepicker.setLocalDate(date);

        $(this._element).on('changeDate', (evt: any) => {
            // this.date = evt.localDate.getTime();
            this.date = moment(evt.localDate.getTime()).milliseconds(0).valueOf();
            this._onChange();
        });
        $('.timepicker-today').on('click', (evt: any) => {
            const date = new Date();
            this.datetimepicker.setLocalDate(date);
            // this.date = date;
            this.date = moment(date).milliseconds(0).valueOf();
            this._onChange();
        });
    }

    private _onChange() {
        this.changedDate.emit({
            datetime: this.date
        });
    }

    private _destroy() {
        $(this._element).remove();
    }

    private _setIdAttribute() {
        if (!this._element.hasAttribute('id') || this._element.hasAttribute('id') === null) {
            this.uuid = `a3Datetimepicker___${UUIDUtil.new()}`;
            this._element.setAttribute('id', this.uuid);
        }
    }



}
