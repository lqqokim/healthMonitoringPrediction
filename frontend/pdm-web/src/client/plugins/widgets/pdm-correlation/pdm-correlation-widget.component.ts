import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

@Component({
    moduleId: module.id,
    selector: 'pdm-correlation-widget',
    templateUrl: './pdm-correlation-widget.html',
    styleUrls: ['./pdm-correlation-widget.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmCorrelationWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {
   
    constructor() {
        super();
    }

    ngOnSetup() {
        this.hideSpinner();
        this.disableConfigurationBtn(true); // Disable Widget Config
    }

    ngOnInit() {

    }

    refresh({ type, data }: WidgetRefreshType): void {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    ngOnDestroy() {

    }
}
