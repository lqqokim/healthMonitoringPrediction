import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { IWorstEeqList, ITimePeriod } from '../../common/status-chart-canvas/status-change.component';

//* ng2-tree Interface
// import { TreeModel } from 'ng2-tree';

@Component({
    moduleId: module.id,
    selector: 'pdm-worst-eqp-list',
    templateUrl: 'pdm-worst-eqp-list.html',
    styleUrls: ['pdm-worst-eqp-list.css'],
    providers: [PdmWostEqpListService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})

export class PdmWostEqpListComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    drawColors:Array<any> = [
        {name:'run', color:'#1b6bce'},
        {name:'normal', color:'#00b050'},
        {name:'warning', color:'#ffc000'},
        {name:'alarm', color:'#ff0000'},
        {name:'failure', color:'#000000'},
        {name:'offline', color:'#a6a6a6'}
    ];

    private timePeriod: ITimePeriod = {
        fromDate : 1532044800000, // new Date(2018, 6, 20, 09, 0, 0, 0).getTime(),
        toDate : 1532077200000 // new Date(2018, 6, 20, 18, 0, 0, 0).getTime()
    };

    private targetName: string = 'All Lines';

    /*
        new Date(2018, 6, 20, 09, 0, 0, 0).getTime() - 1532044800000
        new Date(2018, 6, 20, 10, 59, 0, 0).getTime() - 1532051940000
        new Date(2018, 6, 20, 11, 0, 0, 0).getTime() - 1532052000000
        new Date(2018, 6, 20, 13, 30, 11, 0).getTime() - 1532061011000
        new Date(2018, 6, 20, 15, 0, 0, 0).getTime() - 1532066400000
        new Date(2018, 6, 20, 17, 0, 0, 0).getTime() - 1532073600000
        new Date(2018, 6, 20, 18, 0, 0, 0).getTime() - 1532077200000
    */
    listData: Array<IWorstEeqList>= [{
        order: 1,
        equipment: 'EQP34',
        score: 0.83,
        status: [
            {type: 'run', start:1532044800000, end:1532051940000 },
            {type: 'normal', start:1532051940000, end:1532052000000 },
            {type: 'warning', start:1532052000000, end:1532061011000 },
            {type: 'alarm', start:1532061011000, end:1532066400000 },
            {type: 'failure', start:1532066400000, end:1532073600000 },
            {type: 'offline', start:1532073600000, end:1532077200000 }
        ]
    }, {
        order: 2,
        equipment: 'EQP51',
        score: 0.75,
        status: [
            {type: 'normal', start:1532044800000, end:1532046600000 },
            {type: 'warning', start:1532046600000, end:1532057820000 },
            {type: 'alarm', start:1532057820000, end:1532059200000 },
            {type: 'offline', start:1532059200000, end:1532062500000 },
            {type: 'failure', start:1532062500000, end:1532062800000 },
            {type: 'run', start:1532062800000, end:1532077200000 }
        ]
    }, {
        order: 3,
        equipment: 'EQP34',
        score: 0.72,
        status: [
            {type: 'run', start:1532044800000, end:1532051940000 },
            {type: 'normal', start:1532051940000, end:1532052000000 },
            {type: 'warning', start:1532052000000, end:1532061011000 },
            {type: 'alarm', start:1532061011000, end:1532066400000 },
            {type: 'failure', start:1532066400000, end:1532073600000 },
            {type: 'offline', start:1532073600000, end:1532077200000 }
        ]
    }, {
        order: 4,
        equipment: 'EQP34',
        score: 0.69,
        status: [
            {type: 'alarm', start:1532044800000, end:1532045530500 },
            {type: 'run', start:1532045530500, end:1532056200000 },
            {type: 'warning', start:1532056200000, end:1532061011000 },
            {type: 'offline', start:1532061011000, end:1532077200000 }
        ]
    }, {
        order: 5,
        equipment: 'EQP34',
        score: 0.66,
        status: [
            {type: 'run', start:1532044800000, end:1532051940000 },
            {type: 'normal', start:1532051940000, end:1532052000000 },
            {type: 'warning', start:1532052000000, end:1532061011000 },
            {type: 'alarm', start:1532061011000, end:1532066400000 },
            {type: 'failure', start:1532066400000, end:1532073600000 },
            {type: 'offline', start:1532073600000, end:1532077200000 }
        ]
    }];
    
    
    //* ng2-tree 내용
    // tree: TreeModel = {
    //     value: 'Programming languages by programming paradigm',
    //     children: [{
    //         value: 'Object-oriented programming',
    //         children: [
    //             {value: 'Java'},
    //             {value: 'C++'},
    //             {value: 'C#'},
    //         ]
    //     }, {
    //         value: 'Prototype-based programming',
    //         children: [
    //             {value: 'JavaScript'},
    //             {value: 'CoffeeScript'},
    //             {value: 'Lua'},
    //         ]
    //     }]
    // };
    
    // TODO: Contour chart disable

    constructor(
        private dataSvc: PdmWostEqpListService,
        private translater: Translater
    ){
        super();
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
