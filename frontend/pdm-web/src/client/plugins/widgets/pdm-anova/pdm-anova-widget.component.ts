import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

@Component({
    moduleId: module.id,
    selector: 'pdm-anova-widget',
    templateUrl: './pdm-anova-widget.html',
    styleUrls: ['./pdm-anova-widget.css']
})
export class PdmAnovaWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {
   
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
