// Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup, RequestType } from '../../../common';

//MIP
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { PdmEqpParamAnalysisService } from '../pdm-eqp-param-analysis/pdm-eqp-param-analysis.service';

@Component({
    moduleId: module.id,
    selector: 'pdm-spectrum-data-analysis-widget',
    templateUrl: 'pdm-spectrum-data-analysis-widget.html',
    styleUrls: ['pdm-spectrum-data-analysis-widget.css'],
    providers: [PdmEqpParamAnalysisService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmSpectrumDataAnalysisWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {

    condition: any;

    constructor() {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngOnInit() {

    }

    refresh({ type, data }: WidgetRefreshType): void {
        // this.showSpinner();
        // this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }

        this.setCondition();
    }

    setCondition(): void {
        // this.condition = true;
    }

    // onLoad(ev: any): void {
    //     if (ev.isLoad) {
    //         this.hideSpinner();
    //     } else {
    //         this.hideSpinner();
    //     }
    // }

    private _init(): void {
        // this.showSpinner();
        this.setCondition();
    }

    ngOnDestroy() {

    }
}
