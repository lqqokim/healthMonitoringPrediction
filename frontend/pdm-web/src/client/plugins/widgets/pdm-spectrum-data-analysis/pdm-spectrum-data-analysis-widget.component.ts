// Angular
import { Component, ViewEncapsulation, ViewChild, OnDestroy, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup, RequestType } from '../../../common';

//MIP
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { PdmEqpParamAnalysisService } from '../pdm-eqp-param-analysis/pdm-eqp-param-analysis.service';

export interface ConditionType {
    fab: {
        fabId: number,
        fabName: string
    },timePeriod: {
        from: number,
        to: number
    } 
}

@Component({
    moduleId: module.id,
    selector: 'pdm-spectrum-data-analysis-widget',
    templateUrl: 'pdm-spectrum-data-analysis-widget.html',
    styleUrls: ['pdm-spectrum-data-analysis-widget.css'],
    providers: [PdmEqpParamAnalysisService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmSpectrumDataAnalysisWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {
    condition: ConditionType;

    private _currentEl: any;
    private _props: any;

    constructor() {
        super();
    }

    ngOnSetup() {
        this._init();
    }

    ngOnInit() {
        this.removeBlur();
    }

    refresh({ type, data }: WidgetRefreshType): void {
        this._props = data;

        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }

        this.setCondition(data);
    }

    setCondition(props: any): void {
        this.condition = {
            fab: props[CD.PLANT],
            timePeriod: props[CD.TIME_PERIOD]
        };
    }

    onLoad(ev: any): void {
        if (ev) {
            this.hideSpinner();
        }
    }

    private _init(): void {
        // this.showSpinner();
        // this.removeBlur();
        this._props = this.getProperties();
        this.setCondition(this._props);
    }

    removeBlur(): void {
        this._currentEl = $('pdm-spectrum-data-analysis-widget');
        const parentEl = this._currentEl.parent();
        
        if (parentEl.hasClass('blur')) {
            parentEl.removeClass('blur');
        }
    }

    ngOnDestroy() {

    }
}
