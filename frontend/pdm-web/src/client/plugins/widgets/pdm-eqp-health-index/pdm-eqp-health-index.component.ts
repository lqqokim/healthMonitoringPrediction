import { Component, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmEqpHealthIndexService } from './pdm-eqp-health-index.service';
import { TableData, TableCellInfo, TableComponent } from '../../common/ng2-table/table.component';
import { ITimePeriod, WidgetChartConditionComponent } from '../../common/widget-chart-condition/widget-chart-condition.component';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';
import { ModalPopComponent } from './components/modal-popup/modal-pop.component';
import { LogicChartComponent } from './components/logic-chart/logic-chart.component';

// 서버 요청 데이터 포맷
export interface IReqDataFormat {
    alarm_count: number;
    area_id: number;
    area_name: string;
    description: string;
    eqp_id: number;
    eqp_name:string;
    health_index: number;
    health_logic_mst_rawid: number;
    logic1: number;
    logic2: number;
    logic3: number;
    logic4: number;
    score: number;
}

enum chartIdx {
    TIMESTAMP = 0,
    VALUE,
    ALARM,
    WARNING
};

//* Logic1 (Standard)
export interface IReqDataFormat_chart_logic1 {
    [key: number]: number;
}

//* Logic2 (SPC)
export interface IReqDataFormat_chart_logic2 {
    eqpHealthTrendData: Array<IReqDataFormat_chart_logic1>;
    scpPeriod: Array<Array<number>>;
}

//* Logic3 (Variation)
export interface IReqDataFormat_chart_logic3 {
    eqpHealthTrendData: Array<IReqDataFormat_chart_logic1>;
    period_avg: number;
    previous_avg: number;
    previous_date: number;
    sigma: number;
}

//* Logic4 (RUL)
export interface IReqDataFormat_chart_logic4 {
    eqpHealthTrendData: Array<IReqDataFormat_chart_logic1>;
    rulStartTime: number;
    rulStartValue: number;
    rulEndTime: number;
    rulEndValue: number;
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

    @ViewChild('condition') condition: WidgetChartConditionComponent;
    @ViewChild('table') table: TableComponent;
    @ViewChild('modalPop') modalPop: ModalPopComponent;
    @ViewChild('logicChart') logicChart: LogicChartComponent;

    public columns: Array<TableData> = [
        {title: 'Line', name: 'Line' },
        {title: 'Equipment', name: 'Equipment' },
        {title: 'Health Index', name: 'HealthIndex' },
        {title: 'Standard', name: 'Logic1' },
        {title: 'SPC', name: 'Logic2' },
        {title: 'Variation', name: 'Logic3' },
        {title: 'RUL', name: 'Logic4' },
        {title: 'Alarm Count', name: 'AlarmCount'},
        {title: 'Description', name: 'Description'}
    ];

    // public data:Array<any> = [
    //     {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'Unbalance', Description: ''},
    //     {Time: '', EQP:'EQP36', Param:'Temp', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP37', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP38', Param:'Pressure', Category:'Warning', FaultClass: 'N/A', Description: ''},
    //     {Time: '', EQP:'EQP39', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A', Description: ''},
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

    // 모달 팝업 타이틀
    private modalPopTitle: string = '';

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

    //* 테이블 셀 타이틀 가져오기
    getCellTile( columnName: string ): string {
        let i: number;
        let columns: Array<TableData> = this.columns;
        const max: number = columns.length;

        for(i=0; i<max; i++){
            if( columnName === columns[i].name ){
                return columns[i].title;
            }
        }

        return undefined;
    }

    //* 셀 클릭 정보
    cellClick(data: TableCellInfo): void {
        // 컬럼 name
        const columnName = data.column;

        // 로직1~4 에 해당하는게 아니면 건너 뜀
        if( !(columnName === 'Logic1' || columnName === 'Logic2' || columnName === 'Logic3' || columnName === 'Logic4') ){ return; }

        // 타이틀 설정
        this.modalPopTitle = `${data.row['Equipment']} - ${this.getCellTile(columnName)} (${data.row[columnName]})`;

        // console.log( 'cellClick', data );

        //* 차트 데이터 불러오기
        this.getChartData( <number>data.row['eqp_id'], <string>columnName );
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

        // 타임 출력
        this.condition.timeConvert( this.timePeriod );

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
                    Line: row.area_name,
                    Equipment: row.eqp_name,
                    HealthIndex: row.health_index,
                    Logic1: row.logic1,
                    Logic2: row.logic2,
                    Logic3: row.logic3,
                    Logic4: row.logic4,
                    AlarmCount: row.alarm_count,
                    Description: row.description === null ? '' : row.description,
                    area_id: row.area_id,           // db 쿼리 용
                    eqp_id: row.eqp_id              // db 쿼리 용
                });
            }

            // 테이블 내용 보이기
            this.table.dataBindSwitchOn();
            this.hideSpinner();
        },(err: any)=>{
            console.log('err', err);
            this.hideSpinner();
        });
    }

    //* logic chart 데이터 가져오기
    getChartData( eqpId: number, logicType: string ){
        this.showSpinner();

        this._service.getChartData({
            logicType: logicType,
            fabId: this.fabId,
            areaId: this.areaId,
            eqpId: eqpId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate,
            resultCallback: (res:
                Array<IReqDataFormat_chart_logic1> |
                IReqDataFormat_chart_logic2 | 
                IReqDataFormat_chart_logic3 | 
                IReqDataFormat_chart_logic4
            )=>{
                console.log( res );

                // 차트 그리기
                this.logicChart.setParam( logicType, res, this.timePeriod.fromDate, this.timePeriod.toDate);

                // 팝업창 띄우기
                this.modalPop.open();

                this.hideSpinner();
            },
            errorCallback: (err: any)=>{
                this.hideSpinner();
            }
        });
    }
}
