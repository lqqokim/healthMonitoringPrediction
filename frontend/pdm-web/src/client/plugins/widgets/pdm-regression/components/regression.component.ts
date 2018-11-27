import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { paramTrendData } from '../model/mock-data';

// import * as ITrend from './param-trend/param-trend.component';

export interface TrendCondition {
    eqpIds: number[];
    fabId: string;
    parameters: string[];
    timePeriod: {
        from: number;
        to: number;
    };
};

export interface TrendData {
    eqpIds: number[];
    fabId: string;
    paramId: number;
    parameters: string[];
    timePeriod: {
        from: number;
        to: number;
    };
};

@Component({
    moduleId: module.id,
    selector: 'regression',
    templateUrl: './regression.html',
    styleUrls: ['./regression.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegressionComponent implements OnInit, OnChanges, OnDestroy {

    trendData: TrendData;

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit() {

    }

    onAnalysis(condition: TrendCondition) {
        console.log('condition => ', condition);

        const mokConditon: TrendData = {
            'eqpIds': []
            , 'fabId': 'fab1'
            , 'paramId': 1274
            , 'parameters': []
            , 'timePeriod': { 'from': condition.timePeriod.from, 'to': condition.timePeriod.to }
        };

        this.trendData = JSON.parse(JSON.stringify(mokConditon));
    }

    ngOnDestroy() {

    }
}