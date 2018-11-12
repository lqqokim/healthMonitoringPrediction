import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { heatmapData } from './../model/mock-data';
import { SpinnerComponent } from '../../../../sdk';

export interface Heatmap {

}

export interface Scatter {

}

export interface Trend {

}

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

    heatmapData: Heatmap;
    scatterData: Scatter;
    trendData: Trend;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit() {

    }

    onClickHeatmap(heatmapCell): void {
        console.log('heatmap cell => ', heatmapCell);
        this.scatterData = JSON.parse(JSON.stringify(heatmapCell));
        this.trendData = JSON.parse(JSON.stringify(heatmapCell));
    }

    onAnalysis(condition) {
        console.log('onAnalysis filter condition data => ', condition);
        this.spinner.showSpinner();
        //api call
        this.heatmapData = JSON.parse(JSON.stringify(heatmapData));
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