import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmEqpHealthIndexService } from './pdm-eqp-health-index.service';
import { TableData, TableCellInfo } from '../../common/ng2-table/table.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';
import { IGuageChartData, IColorSet } from '../../common/guage-chart/guageChart.component';

// 서버 요청 데이터 포맷
export interface IReqDataFormat {
    alarm_dtts: number;
    area_id: number;
    area_name: string;
    eqp_id: number;
    eqp_name: string;
    param_id: number;
    param_name: string;
    category: string;
    fault_class: string;
}

@Component({
    moduleId: module.id,
    selector: 'pdm-eqp-health-index',
    templateUrl: 'pdm-eqp-health-index.html',
    styleUrls: ['pdm-eqp-health-index.css'],
    providers: [PdmEqpHealthIndexService],
    encapsulation: ViewEncapsulation.None
})

export class PdmEqpHealthIndex extends WidgetApi implements OnSetup, OnDestroy {

    public columns: Array<TableData> = [
        {title: 'Line', name: 'Line' },
        {title: 'Equipment', name: 'Equipment' },
        {title: 'Health Index', name: 'HealthIndex' },
        {title: 'Logic 1', name: 'Logic1' },
        {title: 'Logic 2', name: 'Logic2' },
        {title: 'Logic 3', name: 'Logic3' },
        {title: 'Logic 4', name: 'Logic4' },
        {title: 'Alarm Count', name: 'AlarmCount'},
        {title: 'Description', name: 'Description'}
    ];

    // public data:Array<any> = [
    //     {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'Unbalance', Description: ''},
    //     {Time: '', EQP:'EQP36', Param:'Temp', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP34', Param:'Pressure', Category:'Warning', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    // ];

    // 페이징, 전체 필터 숨기기
    public paging:boolean = false;
    public totalFilter:boolean = false;

    // 날짜 범위 (config 값 사용)
    private timePeriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    // 타겟 이름 (초기 기본명 세팅)
    private targetName: string = 'All Lines';

    // worst eqp list 데이터
    private listData: Array<any> = [];

    // fab, area IDs
    private fabId: string = '';
    private areaId: number = undefined;

    // 위젯 컨피그 헬퍼
    private confgHelper: WidgetConfigHelper;

    // 라인차트 데이터
    private lineData: any = {
        columns: [
            ['x', '2013-01-01', '2013-01-02', '2013-01-03', '2013-01-04', '2013-01-05', '2013-01-06'],
            ['data1', 30, 200, 100, 400, 150, 250],
            ['data2', 130, 340, 200, 500, 250, 350]
        ]
    };
    
    // 게이지 차트
    private chartData: Array<IGuageChartData> = [
        { name: "Good", start:0.8, end:1 },
        { name: "Waning", start:0.35, end:0.8 },
        { name: "Alarm", start: 0, end:0.35 }
    ];

    //* 표 색상 배열
    private chartColor: Array<IColorSet> = [
        { name:'Good', color: '#fb641e'},
        { name:'Waning', color: '#fdd35b'},
        { name:'Alarm', color: '#8bad6a'},
    ];

    private dataRangeStart: number = 0;
    private dataRangeEnd: number = 100;
    private markerCount: number = 5;
    private guagePoinerPercent: number = 0.7;

    private loopArr: Array<number> = [0,0,0,0,0];

    constructor(
        private _service: PdmEqpHealthIndexService
    ){
        super();
        this.confgHelper = new WidgetConfigHelper( this, this.getData.bind(this) );
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();

        if( !this.isConfigurationWidget ){
            this.confgHelper.setConfigData('DAY', undefined, 1);
        }
        this.confgHelper.setConfigInfo('init', this.getProperties());
    }

    //* 셀 클릭 정보
    cellClick(data: TableCellInfo){
        console.log( 'cellClick-data', data );
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

    //* 데이터 가져오기
    getData( configData: IConfigData ){
        // 헬퍼를 통해 넘어온 값 설정
        this.fabId = configData.fabId;
        this.targetName = configData.targetName;
        this.timePeriod = configData.timePeriod;

        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            let i: number,
                max: number = res.length,
                row: IReqDataFormat
            ; 

            for( i=0; i<max; i++ ){
                row = res[i];
                this.listData.push({
                    Time: moment(row.alarm_dtts).format('YYYY-MM-DD HH:mm:ss.ms'),
                    EQP: row.eqp_name,
                    Param: row.param_name,
                    Category: row.category,
                    FaultClass: row.fault_class
                });
            }

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            this.listData = [
                {Line: '', Equipment:'EQP34', HealthIndex:0.93, Logic1:0.11, Logic2:0.93, Logic3:0.15, Logic4:0.11, AlarmCount:3, Description:''},
                {Line: '', Equipment:'EQP36', HealthIndex:0.91, Logic1:0.11, Logic2:0.91, Logic3:0.31, Logic4:0.21, AlarmCount:2, Description:''},
                {Line: '', Equipment:'EQP34', HealthIndex:0.88, Logic1:0.88, Logic2:0.44, Logic3:0.22, Logic4:0.11, AlarmCount:4, Description:''},
                {Line: '', Equipment:'EQP34', HealthIndex:0.83, Logic1:0.11, Logic2:0.83, Logic3:0.11, Logic4:0.22, AlarmCount:3, Description:''},
                {Line: '', Equipment:'EQP34', HealthIndex:0.81, Logic1:0.22, Logic2:0.51, Logic3:0.22, Logic4:0.81, AlarmCount:1, Description:''},
            ];

            console.log('err', err);
            console.log('this.listData', this.listData);
            this.hideSpinner();
        });
    }
}
