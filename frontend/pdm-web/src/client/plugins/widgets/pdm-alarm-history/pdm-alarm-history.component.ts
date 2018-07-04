import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup, PdmModelService } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmAlarmHistoryService } from './pdm-alarm-history.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { TableData } from '../../common/ng2-table/table.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-history',
    templateUrl: 'pdm-alarm-history.html',
    styleUrls: ['pdm-alarm-history.css'],
    providers: [PdmAlarmHistoryService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})

export class PdmAlarmHistoryComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    private timePeriod: ITimePeriod = {
        fromDate : 1532044800000, // new Date(2018, 6, 20, 09, 0, 0, 0).getTime(),
        toDate : 1532077200000 // new Date(2018, 6, 20, 18, 0, 0, 0).getTime()
    };

    private targetName: string = 'All Lines';

    public columns: Array<TableData> = [
        {title: 'Time', name: 'Time' },
        {title: 'EQP', name: 'EQP', sort:'', filtering: {filterString: '', placeholder: 'Filter by EPQ'}},
        {title: 'Param', name: 'Param', sort: 'asc'},
        {title: 'Category', name: 'Category', filtering: {filterString: '', placeholder: 'Filter by Category'}},
        {title: 'Fault Class', name: 'FaultClass', filtering: {filterString: '', placeholder: 'Filter by Fault Class'} },
        {title: 'Description', name: 'Description'}
    ];

    public data:Array<any> = [
        {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'Unbalance', Description: ''},
        {Time: '', EQP:'EQP36', Param:'Temp', Category:'Alarm', FaultClass: 'N/A', Description: ''},
        {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
        {Time: '', EQP:'EQP34', Param:'Pressure', Category:'Warning', FaultClass: 'N/A', Description: ''},
        {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    ];

    public paging:boolean = true;

    constructor(
        private _pdmModel: PdmModelService
    ){
        super();
    }

    ngOnSetup() {
        this.showSpinner();
        this.init();
        // this.hideSpinner();

        this._pdmModel.getAlarmClassificationSummary('fab1', 200, {
            fromDate: 1530284400000,
            toDate: 1530370800000
        }).subscribe((res: any)=>{
            console.log('res', res);
        }, (err:any)=>{
            console.log('err', err);
        });
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
