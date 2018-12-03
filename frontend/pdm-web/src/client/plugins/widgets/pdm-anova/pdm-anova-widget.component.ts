import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation } from '@angular/core';
import { WidgetApi, WidgetRefreshType, OnSetup } from '../../../common';

import { AnovaComponent } from './components/anova.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-anova-widget',
    templateUrl: './pdm-anova-widget.html',
    styleUrls: ['./pdm-anova-widget.css'],
    encapsulation: ViewEncapsulation.None
})
export class PdmAnovaWidgetComponent extends WidgetApi implements OnInit, OnSetup, OnDestroy {
    @ViewChild('container') container: ElementRef;

    private _currentEl: ElementRef['nativeElement'] = undefined;
    private resizeCallback: Function = this.onResize.bind(this);

    constructor() {
        super();
    }

    ngOnSetup() {
        this.hideSpinner();
        this.disableConfigurationBtn(true); // Disable Widget Config
    }

    ngOnInit() {
        this._currentEl = $(this.container.nativeElement).parents('li.a3-widget-container')[0];

        if (this._currentEl !== undefined) {
            this._currentEl.addEventListener('transitionend', this.resizeCallback, false);
            this.onResize();
        }
    }

    onResize(e?: TransitionEvent): void {
        if ((e !== undefined && !e.isTrusted) || this._currentEl === undefined) { return; }
        if (e) {
            // console.log('e => ', e);
            let comp = new AnovaComponent();
            // comp.relayoutHeatmap();

            // const chartBodyEl = $(this.chartBody.nativeElement);
            // if(chartBodyEl) {
            //     this.lineStatusTrendComp.onChartResize({
            //         width: chartBodyEl.width(),
            //         height: chartBodyEl.height()
            //     });
            // }
        }
    }

    refresh({ type, data }: WidgetRefreshType): void {
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {

        } else if (type === A3_WIDGET.JUST_REFRESH) {

        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {

        }
    }

    spinnerControl(ev) {

    }

    ngOnDestroy() {

    }
}
