import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: '[a3c-map-slidebar]',
    template: `
        <div class="range">
            <input class="range-slidebar" name="range" type="range" #slider>
        </div>
    `
})
export class SliderbarComponent implements OnInit, OnDestroy {

    @ViewChild('slider') sliderEl: ElementRef;
    @Input() appAttr: any;
    @Output() onEnd = new EventEmitter<any>();
    @Output() onMove = new EventEmitter<any>();
    @Output() onEvent = new EventEmitter<any>();


    ngOnInit() {
        this._init();
    }

    _init() {
        let options = this._setOptions();
        this._setAttributes(this.appAttr);
        this._getSliderEvent();
        $(this.sliderEl.nativeElement).rangeslider(options);
    }

    private _setOptions() {
        let options = {
            polyfill: false, //Never use the native polyfill
			rangeClass: 'rangeslider',
			disabledClass: 'rangeslider-disabled',
			horizontalClass: 'rangeslider-horizontal',
			verticalClass: 'rangeslider-vertical',
			fillClass: 'rangeslider-fill-lower',
			handleClass: 'rangeslider-thumb',
			onInit: () => { },
            onSlide: (position, value) => {
                this._onSlide(position, value);
            },
            onSlideEnd: (position, value) => {
                this._onSlideEnd(position, value);
            },
        }

        return options;
    }

    private _setAttributes(attr: any) {
        let attrObj: any;
        if (attr) {
            attrObj = attr;
        } else {
            attrObj = {
                min: 0,
                max: 100,
                step: 10,
                value: 0
            };
        }
        $(this.sliderEl.nativeElement).attr(attrObj);
    }

    private _onSlide(position: any, value: number) {
        this.onValueOutput(value);
    }

    private _onSlideEnd(position: any, value: number) {
        this.endValueOutput(value);
    }

    private _getSliderEvent() {
        $('div.range').on('mouseover mouseout', (evt: any) => {
            this.getEvent(evt);
        });
    }

    onValueOutput(value: number) {
        this.onMove.emit(value);
    }

    endValueOutput(value: number) {
        this.onEnd.emit(value);
    }

    getEvent(evt: any) {
        this.onEvent.emit(evt);
    }

    destroy() {
        $(this.sliderEl.nativeElement).rangeslider('destroy');
    }

    ngOnDestroy() {
        this.destroy();
    }
}

