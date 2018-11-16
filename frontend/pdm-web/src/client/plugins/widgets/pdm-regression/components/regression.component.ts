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
        // console.warn('goddddddddddddddddddd'); 
        let mokConditon:any = {            
            'eqpIds': []
            ,'fabId': 'fab1'
            ,'paramId':1274
            ,'parameters': []
            ,'timePeriod': {'from': condition.timePeriod.from, 'to': condition.timePeriod.to}            
        }

        console.log('condition => ', condition);
        this.paramTrendData = JSON.parse(JSON.stringify(mokConditon))
    }

    ngOnDestroy() {

    }
}