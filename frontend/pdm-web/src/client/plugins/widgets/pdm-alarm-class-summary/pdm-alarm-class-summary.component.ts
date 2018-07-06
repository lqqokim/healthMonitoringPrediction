import { Component, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { IDonutChartData, IColorSet, DonutChartComponent } from '../../common/donut-chart/donutChart.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';
import { PdmAlarmClassSummaryService } from './pdm-alarm-class-summary.service';

// 새로 고침 시 사용될 interface
export interface IPrevData {
    fabId: string;
    targetName: string;
    timePeriod: ITimePeriod;
}

// 서버 요청 데이터 포맷
export interface IReqDataFormat {
    fault_class: string;
    count: number;
}

@Component({
    moduleId: module.id,
    selector: 'pdm-alarm-class-summary',
    templateUrl: 'pdm-alarm-class-summary.html',
    styleUrls: ['pdm-alarm-class-summary.css'],
    providers: [PdmAlarmClassSummaryService],
    encapsulation: ViewEncapsulation.None
})

export class PdmAlarmClassSummaryComponent extends WidgetApi implements OnSetup, OnDestroy {

    @ViewChild('donutChart') donutChart: DonutChartComponent;
    
    private chartColorBase: Array<IColorSet> = [
        { name: 'Unblance', color: '#4472c4' },
        { name: 'Misalignment', color: '#ed7d31' },
        { name: 'Bearing', color: '#a5a5a5' },
        { name: 'Lubrication', color: '#ffc000' },
        { name: 'N/A', color: '#5b9bd5' }
    ];

    private chartColor: Array<IColorSet> = [];

    // private chartData: Array<IDonutChartData> = [
    //     { name: "Unblance", count: 10 },
    //     { name: "Misalignment", count: 7 },
    //     { name: "Bearing", count: 20 },
    //     { name: "Lubrication", count: 2 },
    //     { name: "Etc", count: 38 }
    // ];

    // 날짜 범위 (config 값 사용)
    private timePeriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    // 타겟 이름 (초기 기본명 세팅)
    private targetName: string = 'All Lines';

    // 차트 데이터
    private chartData: Array<IDonutChartData> = [];

    // fab, area IDs
    private fabId: string = '';
    private areaId: number = undefined;

    // 위젯 새로고침 시 되돌릴 데이터 값
    private prevData: IPrevData = {
        fabId: '',
        targetName: '',
        timePeriod: {
            fromDate: 0,
            toDate: 0
        }
    };

    constructor(
        private _service: PdmAlarmClassSummaryService
    ){
        super();
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();
        this.setConfigInfo('init', this.getProperties());

        console.log( this.donutChart );
    }

    //* 컨피그 설정
    setConfigInfo( type: string, syncData?: any ): void {

        // 새로고침 (이전 컨피그 상태로 되돌림)
        if( type === A3_WIDGET.JUST_REFRESH ){
            this.fabId = this.prevData.fabId;
            this.timePeriod = this.prevData.timePeriod;
            this.targetName = this.prevData.targetName;
            this.areaId = undefined;

            // this.timePeriod = {
            //     fromDate: 1532044800000,
            //     toDate: 1532077200000
            // };

            // this.setProp('cutoffType', 'DATE' );
            this.setProp('timePeriod', this.timePeriod );
        }
        // 컨피그 설정 적용
        else if( type === A3_WIDGET.APPLY_CONFIG_REFRESH || type === 'init' ){
            this.fabId = syncData.plant.fabId;
            this.timePeriod.fromDate = syncData[CD.TIME_PERIOD].from;
            this.timePeriod.toDate = syncData[CD.TIME_PERIOD].to;
            this.areaId = undefined;

            // 컨피그로 설정된 값 저장 용
            this.prevData = {
                fabId: this.fabId,
                timePeriod: this.timePeriod,
                targetName: this.targetName
            };
        }
        // 다른 위젯 데이터 싱크
        else if( type === A3_WIDGET.SYNC_INCONDITION_REFRESH ){
            this.targetName = syncData[CD.AREA][CD.AREA_NAME];
            this.areaId = syncData[CD.AREA][CD.AREA_ID];
            this.timePeriod.fromDate = syncData[CD.TIME_PERIOD].from;
            this.timePeriod.toDate = syncData[CD.TIME_PERIOD].to;

            // this.setProp('fromDate', this.timePeriod.fromDate);
        }

        // 데이터 요청
        this.getData();
    }

    //* APPLY_CONFIG_REFRESH-config 설정 값, JUST_REFRESH-현 위젯 새로고침, SYNC_INCONDITION_REFRESH-위젯 Sync
    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        this.setConfigInfo( type, data );
    }

    ngOnDestroy() {
        this.destroy();
    }

    //* 레전드 재설정
    resetLegend(){
        let row, color;

        if( this.chartColor.length ){
            this.chartColor.splice(0, this.chartColor.length);
        }

        for( row of this.chartData ){
            for( color of this.chartColorBase ){
                if( color.name === row.name ){
                    this.chartColor.push(color);
                    break;
                }
            }
        }
    }

    //* 데이터 가져오기
    getData(){
        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
            console.log('pdm-alarm-class-summary', res);
            if( this.chartData.length ){
                this.chartData.splice(0, this.chartData.length);
            }

            let i: number,
                max: number = res.length,
                row: IReqDataFormat
            ; 

            for( i=0; i<max; i++ ){
                row = res[i];
                this.chartData.push({
                    name: row.fault_class,
                    count: row.count
                });
            }

            this.resetLegend();
            this.donutChart.reDrawChart();

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.chartData.length ){
                this.chartData.splice(0, this.chartData.length);
            }

            this.chartData = [
                { name: "Unblance", count: 10 },
                // { name: "Misalignment", count: 7 },
                // { name: "Bearing", count: 20 },
                { name: "Lubrication", count: 2 },
                { name: "N/A", count: 38 }
            ];

            this.resetLegend();
            this.donutChart.reDrawChart();

            console.log('err', err);
            this.hideSpinner();
        });
    }
}
