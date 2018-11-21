import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { heatmapData } from './../model/mock-data';
import { SpinnerComponent } from '../../../../sdk';

import { Trend } from './../components/trend/trend.component';

@Component({
    moduleId: module.id,
    selector: 'correlation',
    templateUrl: './correlation.html',
    styleUrls: ['./correlation.css'],
    encapsulation: ViewEncapsulation.None
})
export class CorrelationComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('Spinner') spinner: SpinnerComponent;
    @Output() SpinnerControl: EventEmitter<any> = new EventEmitter();

    heatmapData;
    scatterData;
    trendData: Trend;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit() {

    }

    onClickHeatmap(heatmapCell): void {
        console.log('heatmap cell => ', heatmapCell);
        this.drawScatter(heatmapCell);
        this.drawTrend(heatmapCell);
    }

    onAnalysis(condition) {
        console.log('onAnalysis filter condition data => ', condition);
        this.spinner.showSpinner();
        //api call

        this.drawHeatmap(heatmapData);        
    }

    drawHeatmap(data): void {
        this.heatmapData = JSON.parse(JSON.stringify(data));
    }

    drawScatter(data) {
        this.scatterData = JSON.parse(JSON.stringify(data));

    }

    drawTrend(data) {
        this.trendData = {
            datas: JSON.parse(JSON.stringify(data)),
            type: 'lines'
        };
    }

    spinnerControl(ev) {
        if(ev) {
            this.spinner.showSpinner();
        } else {
            this.spinner.hideSpinner();
        }
    }

    ngOnDestroy() {

    }
}