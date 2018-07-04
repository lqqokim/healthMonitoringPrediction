import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmWostEqpListService } from './pdm-alarm-class-summary.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { IDonutChartData, IColorSet } from '../../common/donut-chart/donutChart.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-class-summary',
    templateUrl: 'pdm-alarm-class-summary.html',
    styleUrls: ['pdm-alarm-class-summary.css'],
    providers: [PdmWostEqpListService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})

export class PdmAlarmClassSummaryComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    private timePeriod: ITimePeriod = {
        fromDate : 1532044800000, // new Date(2018, 6, 20, 09, 0, 0, 0).getTime(),
        toDate : 1532077200000 // new Date(2018, 6, 20, 18, 0, 0, 0).getTime()
    };

    private targetName: string = 'All Lines';

    private chartColor: Array<IColorSet> = [
        {name:'Unblance', color:'#4472c4' },
        {name:'Misalignment', color:'#ed7d31' },
        {name:'Bearing', color:'#a5a5a5' },
        {name:'Lubrication', color:'#ffc000' },
        {name:'Etc', color:'#5b9bd5' }
    ];

    private chartData: Array<IDonutChartData> = [
        {name:"Unblance", count:10},
        {name:"Misalignment", count:7},
        {name:"Bearing", count:20},
        {name:"Lubrication", count:2},
        {name:"Etc", count:38}
    ];

    private chartData2: Array<IDonutChartData> = [
        {name:"Unblance", count:100},
        {name:"Misalignment", count:37},
        {name:"Bearing", count:40},
        {name:"Lubrication", count:25},
        {name:"Etc", count:38}
    ];

    constructor(
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

        setTimeout(()=>{
            this.chartData = this.chartData2;
            console.log('바꿈', this.chartData );
        }, 10000);
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
