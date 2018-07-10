import { Component, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { IDonutChartData, IColorSet, DonutChartComponent } from '../../common/donut-chart/donutChart.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';
import { PdmAlarmClassSummaryService } from './pdm-alarm-class-summary.service';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';

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
    
    private chartColorBase: Array<string> = [
        '#4472c4',
        '#ed7d31',
        '#a5a5a5',
        '#ffc000',
        '#5b9bd5'
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

    // 위젯 컨피그 헬퍼
    private confgHelper: WidgetConfigHelper;

    constructor(
        private _service: PdmAlarmClassSummaryService
    ){
        super();
        this.confgHelper = new WidgetConfigHelper( this, this.getData.bind(this) );
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();

        if( !this.isConfigurationWidget ){
            this.confgHelper.setConfigData('DAY', undefined, 7);
        }
        this.confgHelper.setConfigInfo('init', this.getProperties());
    }

    //* APPLY_CONFIG_REFRESH-config 설정 값, JUST_REFRESH-현 위젯 새로고침, SYNC_INCONDITION_REFRESH-위젯 Sync
    refresh({ type, data }: WidgetRefreshType) {

        // 처리할 타입만 필터링
        if( !(type === A3_WIDGET.JUST_REFRESH ||
            type === A3_WIDGET.APPLY_CONFIG_REFRESH ||
            type === A3_WIDGET.SYNC_INCONDITION_REFRESH) ){
            return;
        }

        this.showSpinner();
        this.confgHelper.setConfigInfo( type, data );
    }

    ngOnDestroy() {
        delete this.confgHelper;
        this.destroy();
    }

    //* 레전드 재설정
    resetLegend(){
        let
            row: IDonutChartData,
            color: IColorSet,
            tmpColorData: {[key:string]: boolean} = {},
            baseColorIdx: number = 0
        ;

        // 설정된 레전드 컬러값 삭제
        if( this.chartColor.length ){
            this.chartColor.splice(0, this.chartColor.length);
        }

        // 설정 값 컬러 매핑
        for( row of this.chartData ){

            // 중복된 컬러값은 건너 뜀
            if( tmpColorData.hasOwnProperty(row.name) ){ continue; }
            tmpColorData[row.name] = true;

            // 중복되지 않은 컬러값으로 이름과 색상 매칭
            this.chartColor.push({
                name: row.name,
                color: this.chartColorBase[baseColorIdx++]
            });
        }
    }

    //* 데이터 가져오기
    getData( configData: IConfigData ){
        // 헬퍼를 통해 넘어온 값 설정
        this.fabId = configData.fabId;
        this.targetName = configData.targetName;
        this.timePeriod = configData.timePeriod;

        // 서버 데이터 요청
        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: 1527951600000, //this.timePeriod.fromDate,
            toDate: 1530630000000 //this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
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
            
            // 레전드 리셋, 도넛차트 다시 그리기
            this.resetLegend();
            this.donutChart.reDrawChart();

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.chartData.length ){
                this.chartData.splice(0, this.chartData.length);
            }

            this.chartData.push({ name: "Unblance", count: 10 });
            this.chartData.push({ name: "Lubrication", count: 2 });
            this.chartData.push({ name: "N/A", count: 30 });

            this.resetLegend();
            this.donutChart.reDrawChart();

            // console.log('tmpData', this.chartData);
            // console.log('err', err);
            this.hideSpinner();
        });
    }
}
