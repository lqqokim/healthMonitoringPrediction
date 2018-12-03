import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { SpinnerComponent } from '../../../../sdk';

import { CorrelationService } from './../model/correlation.service';
import { Trend } from './../components/trend/trend.component';

import * as ICorrelation from './../model/correlation-interface';

@Component({
    moduleId: module.id,
    selector: 'correlation',
    templateUrl: './correlation.html',
    styleUrls: ['./correlation.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [CorrelationService]
})
export class CorrelationComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('Spinner') spinner: SpinnerComponent;
    @Output() SpinnerControl: EventEmitter<any> = new EventEmitter();

    heatmapData;
    scatterData;
    trendData: Trend;

    constructor(
        private correlationService: CorrelationService
    ) {

    }

    ngOnChanges() {

    }

    ngOnInit() {

    }

    onAnalysis(condition) {
        this.spinner.showSpinner();

        console.log('onAnalysis filter condition data => ', condition);
        const request = {
            fabId: 'fab1',
            fromDate: 1535727600000,
            toDate: 1535738400000,
            body: [1104, 1109, 1110, 1112, 1114, 1123, 1124, 1138, 1281, 1282, 1283, 1284, 1285, 1286]
        };

        this.getHeatmapData(request);
    }

    private getHeatmapData(request): void {
        this.correlationService.getHeatmap(request).subscribe(
            (data: ICorrelation.Response) => {
                console.info('[Correlation] Get Heatmap => ', data);
                this.heatmapData = data;
            }, (err) => {
                console.log('err => ', err);
            }
        );
    }

    onClickHeatmap(cellSeq: Array<number>): void {
        console.log('heatmap cellSeq => ', cellSeq);
        const request = {
            fabId: 'fab1',
            fromDate: 1535727600000,
            toDate: 1535738400000,
            body: cellSeq
        };

        this.getHeatmapCorrelationData(request);
    }

    private getHeatmapCorrelationData(request): void {
        this.correlationService.getHeatmapCorrelation(request).subscribe(
            (data: ICorrelation.Response) => {
                console.info('[Correlation] Get Scatter / Trend => ', data);
                this.scatterData = data;
                this.trendData = {
                    datas: data,
                    type: 'lines'
                };
            }, (err) => {
                console.log('err => ', err);
            }
        )
    }

    spinnerControl(ev) {
        if (ev) {
            this.spinner.showSpinner();
        } else {
            this.spinner.hideSpinner();
        }
    }

    ngOnDestroy() {

    }
}