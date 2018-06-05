import { Ng2NoUiSliderEventInterface, Ng2NoUiSliderInterface } from './ng2-nouislider.interface';
import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'ng2-nouislider',
    templateUrl: 'ng2-nouislider.component.html',
    encapsulation: ViewEncapsulation.None
})

export class Ng2NoUiSliderComponent implements OnChanges {
    slider: any;
    @Input() config: Ng2NoUiSliderInterface;
    @Input() initDisabled: boolean = false;
    @ViewChild('slider') sliderEl: ElementRef;

    constructor() {}

    ngOnChanges(values: any) {
        if (values.config.currentValue) {
            this.slider = this.sliderEl.nativeElement;
            this._createSlider(values.config.currentValue);
            if (values.config.currentValue.slideEvent) {
                this._setEvent(values.config.currentValue.slideEvent);
            }
        }
    }

    _createSlider(config: Ng2NoUiSliderInterface) {
        noUiSlider.create(this.slider, config);
        if (this.initDisabled) {
            this.sliderEl.nativeElement.setAttribute('disabled', true);
        }
    }

    _setEvent(event: Array<Ng2NoUiSliderEventInterface>) {
        event.map( (ev: Ng2NoUiSliderEventInterface) => {
            this.slider.noUiSlider.on(ev.eventName, ev.uiSlideCallback);
        });
    };
}
