import { Component, OnInit, OnChanges } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

@Component({
    moduleId: module.id,
    selector: 'pdm-line-status-summary-widget',
    templateUrl: './pdm-line-status-summary-widget.html',
    styleUrls: ['./pdm-line-status-summary-widget.css']
})
export class PdmLineStatusSummaryWidgetComponent extends WidgetApi implements OnInit {
    private _props: any;

    constructor() {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngOnInit() {

    }

    refresh({ type, data }: WidgetRefreshType) {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === A3_WIDGET.JUST_REFRESH) {
            this.showSpinner();
            this._props = data;
            this._setConfigInfo();
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            
        }
    }

    _setConfigInfo() {
        
    }

    endChartLoad(ev: any) {
        if(ev) {
            this.hideSpinner();
        }
    }

    private _init(): void {
        this.showSpinner();
        // this.setGlobalLabel();
        this._props = this.getProperties();
        this._setConfigInfo();
    }
}
