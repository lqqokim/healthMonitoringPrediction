import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';

//* ng2-tree Interface
import { TreeModel } from 'ng2-tree';

@Component({
    moduleId: module.id,
    selector: 'pdm-worst-eqp-list',
    templateUrl: 'pdm-worst-eqp-list.html',
    styleUrls: ['pdm-worst-eqp-list.css'],
    providers: [PdmWostEqpListService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})
export class PdmWostEqpListComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    areaColumn: string;
    
    //* ng2-tree 내용
    tree: TreeModel = {
        value: 'Programming languages by programming paradigm',
        children: [{
            value: 'Object-oriented programming',
            children: [
                {value: 'Java'},
                {value: 'C++'},
                {value: 'C#'},
            ]
        }, {
            value: 'Prototype-based programming',
            children: [
                {value: 'JavaScript'},
                {value: 'CoffeeScript'},
                {value: 'Lua'},
            ]
        }]
    };
    
    // TODO: Contour chart disable

    constructor(
        private dataSvc: PdmWostEqpListService,
        private translater: Translater
    ){
        super();
        this.dataSvc = dataSvc;
        this.areaColumn = this.translater.instant('LABEL.PDM.AREA');

        // console.log('TreeModule', TreeModule);
    }

    ngOnSetup() {
        this.showSpinner();
        this.init();
        // this.hideSpinner();
    }

    private init(){
        this.hideSpinner();
    }

    /**
     * TODO
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *  justRefresh, applyConfig, syncInCondition
     */
    // tslint:disable-next-line:no-unused-variable
    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
    }

    ngAfterViewInit() {
        // this.shopGrid.selectedItems.splice(0);
        // this.hideSpinner()
    }

    ngOnDestroy() {
        this.destroy();
    }
}
