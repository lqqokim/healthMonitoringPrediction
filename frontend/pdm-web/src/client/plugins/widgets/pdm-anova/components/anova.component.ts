import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild, EventEmitter, Output } from '@angular/core';
import { SpinnerComponent } from '../../../../sdk';

import results from './../model/anova-interface';
import { FilterConditionComponent } from './../../../common/filter-condition/filter-condition.component';

import * as wjcGrid from 'wijmo/wijmo.grid';

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
    @ViewChild('WijmoGridInstance') gridInstance: wjcGrid.FlexGrid;
    @Output() SpinnerControl: EventEmitter<any> = new EventEmitter();

    results;
    selectedResult;

    trendData: any;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit(): void {
        this.filterComp.widgetType = 'anova';
    }

    selectedRow(grid, event) {
        const selectedRow = grid.selectedRows[0];
        const row = selectedRow.dataItem;
        console.log('grid row => ', row);

        this.drawBoxplot(row);
        this.drawTrend(row);
    }

    _firstSelectedData(): void {
        setTimeout(() => {
            if (this.gridInstance.itemsSource && this.gridInstance.itemsSource.length > 0) {
                // this.selectedResult = this.gridInstance.itemsSource[0];
                const firstRow = this.gridInstance.itemsSource[0];

                this.drawBoxplot(firstRow);
                this.drawTrend(firstRow);
            }
        });
    }

    drawBoxplot(row): void {
        this.selectedResult = JSON.parse(JSON.stringify(row));
    }

    drawTrend(row): void {
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
        this._firstSelectedData();
        this.spinner.hideSpinner();
    }

    ngOnDestroy() {

    }
}