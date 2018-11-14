import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { paramTrendData } from './../model/mock-data';

export interface ParamTrend {

}

@Component({
    moduleId: module.id,
    selector: 'regression',
    templateUrl: './regression.html',
    styleUrls: ['./regression.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegressionComponent implements OnInit, OnChanges, OnDestroy{

    paramTrendData: ParamTrend;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    onAnalysis(condition) {
        console.log('onAnalysis filter condition data => ', condition);
        this.paramTrendData = JSON.parse(JSON.stringify(paramTrendData))
    }

    ngOnDestroy() {

    }
}