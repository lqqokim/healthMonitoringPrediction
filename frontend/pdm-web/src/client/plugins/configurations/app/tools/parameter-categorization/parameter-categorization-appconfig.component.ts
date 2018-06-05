import { OnInit, ViewEncapsulation, Component } from '@angular/core';
import { Input, Output, OnChanges, EventEmitter, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import * as wjcGrid from 'wijmo/wijmo.grid';

import {
    AppModelService,
    FdcModelService,
    ModalAction,
    ModalRequester,
    RequestType
} from '../../../../../common';
import { NotifyService, Translater } from '../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'div.parameter-category-appconfig',
    templateUrl: 'parameter-categorization-appconfig.html',
    styleUrls: ['parameter-categorization-appconfig.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [, FdcModelService]
})
export class ParameterCategorizationComponent implements OnInit {

    categories:any;
    isEditModeByCategory: any = false;;

    constructor() { }

    ngOnInit() {

    }

    dataLoadCompleted(ev: any) {
        this.categories = ev.data;
    }

    categoryChangeMode(ev: any) {
        this.isEditModeByCategory = ev.isEditMode;
    }

}
