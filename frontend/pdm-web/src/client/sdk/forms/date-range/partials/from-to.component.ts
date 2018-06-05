/**
 * Usage
 * <a3-from-to class="a3-from-to" [from]="from" [to]="to" (changedFromTo)="changedFromTo($event)"></a3-from-to>
 */
import {
    Component,
    ElementRef,
    OnInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter,
    ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'div.a3-from-to',
    template: `
            <div class="a3-configuration-forms-wrapper clearfix">
                <div class="a3-form-text current-text">From</div>
                 <div class="input-group date input-append a3-datetime-picker"
                    [date]="from"
                    [endDate]="to"
                    [format]="format"
                    (changedDate)="fromChangeDate($event)"></div>
            </div>
            <div class="a3-configuration-forms-wrapper clearfix">
                <div class="a3-form-text current-text">To</div>
                <div class="input-group date input-append a3-datetime-picker"
                    [date]="to"
                    [startDate]="from"
                    [format]="format"
                    (changedDate)="toChangeDate($event)"></div>
            </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class FromToComponent implements OnInit, OnDestroy {
    @Input() from: number;
    @Input() to: number;
    @Input() format: string;
    @Output() changedFromTo: EventEmitter<any> = new EventEmitter();

    private _element: HTMLElement;

    constructor(private element: ElementRef) {}

    ngOnInit() {
        this._element = this.element.nativeElement;
    }

    ngOnDestroy() {
        $(this._element).remove();
    }

    fromChangeDate($event: any) {
        if ($event.datetime) {
            this.from = $event.datetime;
        }

        this.changedFromTo.emit({
            from: this.from,
            to: this.to
        });
    }

    toChangeDate($event: any) {
        if ($event.datetime) {
            this.to = $event.datetime;
        }

        this.changedFromTo.emit({
            from: this.from,
            to: this.to
        });
    }
}
