import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';

import { FilterConditionComponent } from '../../../common/filter-condition/filter-condition';

@Component({
    moduleId: module.id,
    selector: 'regression',
    templateUrl: './regression.html',
    styleUrls: ['./regression.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegressionComponent implements OnInit, OnChanges, OnDestroy{

    constructor() {

    }

    ngOnChanges() {

    }

    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
    }

    ngOnDestroy() {

    }
}