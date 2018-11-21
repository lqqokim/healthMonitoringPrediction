import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { SpinnerComponent } from '../../../../sdk';

import results from './../model/anova-interface';
import { Trend } from './../../pdm-correlation/components/trend/trend.component';
import { FilterConditionComponent } from './../../../common/filter-condition/filter-condition.component';

@Component({
    moduleId: module.id,
    selector: 'anova',
    templateUrl: './anova.html',
    styleUrls: ['./anova.css'],
    encapsulation: ViewEncapsulation.None
})
export class AnovaComponent implements OnInit, OnChanges, OnDestroy {
    @ViewChild('Spinner') spinner: SpinnerComponent;
    @ViewChild('filterComp') filterComp: FilterConditionComponent;
    @Output() SpinnerControl: EventEmitter<any> = new EventEmitter();

    results;
    selectedResult;

    trendData: Trend;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit(): void {
       this.filterComp.isShowCheckGroup = true;
    }

    selectedRow(grid, event) {
        const selectedRow = grid.selectedRows[0];
        const row = selectedRow.dataItem;
        console.log('grid row => ', row);

        this.drawBoxplot(row);
        this.drawTrend(row);
    }

    drawBoxplot(row): void {
        this.selectedResult = JSON.parse(JSON.stringify(row));
    }

    drawTrend(data): void {
        this.trendData = {
            datas: {
                x: "SLIDE_AXIS_TORQUE",
                y: "HOIST_AXIS_TORQUE",
                z: 0.2
            },
            type: 'markers'
        };
    }

    onAnalysis(condition) {
        console.log('onAnalysis filter condition data => ', condition);
        this.spinner.showSpinner();
        //api call

        this.drawResultGrid(condition);
    }

    drawResultGrid(condition): void {
        this.results = JSON.parse(JSON.stringify(results));
        this.spinner.hideSpinner();
    }

    ngOnDestroy() {

    }
}