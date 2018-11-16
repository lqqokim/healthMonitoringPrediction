import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

@Component({
    moduleId: module.id,
    selector: 'pdm-regression-widget',
    templateUrl: './pdm-regression-widget.html',
    styleUrls: ['./pdm-regression-widget.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmRegressionWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {
   
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

    onAnalysis(){
        
    }
}
