import { Component, Input, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';

import { FilterConditionComponent } from '../../../../plugins/common/filter-condition/filter-condition';

@Component({
    moduleId: module.id,
    selector: 'anova',
    templateUrl: './anova.html',
    styleUrls: ['./anova.css'],
    encapsulation: ViewEncapsulation.None
})
export class AnovaComponent implements OnInit, OnChanges, OnDestroy{

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