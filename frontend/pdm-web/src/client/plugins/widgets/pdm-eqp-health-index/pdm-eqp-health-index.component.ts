import { Component, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
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
    health_logic_mst_rawid: number;
    logic1: number;
    logic2: number;
    logic3: number;
    logic4: number;
    logic1Param: number;
    logic2Param: number;
    logic3Param: number;
    logic4Param: number;
    logic1param_name: string;
    logic2param_name: string;
    logic3param_name: string;
    logic4param_name: string;
    score: number;
    upperAlarmSpec: number;
    upperWarningSpec: number;
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

    private columnsDatas: Array<TableData> = [
        {title: 'Line', name: 'line' },
        {title: 'Equipment', name: 'equipment' },
        {title: 'Health Index', name: 'healthIndex' },
        {title: 'Standard', name: 'logic1' },
        {title: 'SPC', name: 'logic2' },
        {title: 'Variation', name: 'logic3' },
        {title: 'RUL', name: 'logic4' },
        {title: 'Alarm Count', name: 'alarmCount'},
        {title: 'Description', name: 'description'}
    ];
    private columns: Array<TableData> = this.columnsDatas.concat();

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
    private modalPopType: string = 'logicChart';    // logicChart, trendChart 2개 타입

    // 리사이즈 용    
    private currElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;

    // 트랜드 차트용
    private
        chartType: string = '';                 // 'alarm';
        trendPlantId: string = '';              // 'fab1';
        trendAreaId: (number|null) = null;  
        trendEqpId: number = undefined;         // 21;
    
        trendParamId: number = undefined;       // 1111;
        trendFromDate: number = undefined;      // 1532962800000;
        trendToDate: number = undefined;        // 1534690800000;
        trendEqpName: string = '';              // 'TOHS03';
        trendParamName: string = '';            // 'Z_RMS';
    
        trendValue: number = undefined;         // 3.044918;
        trendSpecWarning: number = undefined;   // 0.8;

    constructor(
        private _service: PdmEqpHealthIndexService,
        currentElem: ElementRef
    ){
        super();
        this.confgHelper = new WidgetConfigHelper( this, this.getData.bind(this) );
        this.currElem = currentElem.nativeElement;
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();

        if( !this.isConfigurationWidget ){
            this.confgHelper.setConfigData('DAY', undefined, 1);
        }
        this.confgHelper.setConfigInfo('init', this.getProperties());

        //* 위젯 컴포넌트가 transition으로 효과로 인해 캔버스 리사이즈 크기가 제대로 반영 시키기 위함
        this.widgetElem = $(this.currElem).parents('li.a3-widget-container')[0];
        if( this.widgetElem !== undefined ){
            this.widgetElem.addEventListener('transitionend', this.onResize.bind(this), false);
        }
    }

    //* 테이블 셀 타이틀 가져오기
    getCellTile( columnName: string ): string {
        let i: number;
        let columns: Array<TableData> = this.columnsDatas;
        const max: number = columns.length;

        for(i=0; i<max; i++){
            if( columnName === columns[i].name ){
                return columns[i].title;
            }
        }

        return undefined;
    }

    //* 테이블 셀 타이틀 가져오기
    getCellIdx( columnName: string ): number {
        let i: number;
        let columns: Array<TableData> = this.columnsDatas;
        const max: number = columns.length;

        for(i=0; i<max; i++){
            if( columnName === columns[i].name ){
                return i;
            }
        }

        return undefined;
    }

    //* 셀 클릭 정보
    cellClick(data: TableCellInfo): void {
        // 컬럼 name
        let columnName = data.column;
        let chartType: string = undefined;

        // console.log( 'cellClick-data', data );

        // 로직1~4 에 해당 (LogicChart)
        if( (columnName === 'logic1' || columnName === 'logic2' || columnName === 'logic3' || columnName === 'logic4') ){ chartType='logicChart'; }

        // Health Index 해당 (TrendChart 용)
        // if( columnName === 'healthIndex' ){ chartType='trendChart'; }

        // Health Index 해당 (LogicChart 용)
        if( columnName === 'healthIndex' ){
            chartType='logicChart';

            let i: number = 1;
            while( i <= 4 ){
                const keyName = `logic${i}`;
                if( data.row.hasOwnProperty(keyName) && <number>data.row[keyName] === <number>data.row['healthIndex'] ){
                    columnName = keyName;
                    break;
                }
                i++;
            }
        }

        // 차트 타입이 없다면 건너 뜀
        if( chartType === undefined ){ return; }

        // 해당 Logic1~4 param id, name 얻어오기
        const logicParamID: number = <number>data.row[ columnName+'Param' ];
        const logicParamName: string = <string>(
            data.row[ columnName+'param_name' ] === (null || undefined)
                ? ''
                : `[${data.row[ columnName+'param_name' ]}]`
        );

        // 장비명
        const eqpName: string = <string>data.row['equipment'];

        // 셀 컬럼명
        const cellName: string = <string>this.getCellTile(columnName);

        // 선택된 셀 값
        const cellValue: number = <number>data.row[columnName];

        // 타이틀 설정
        this.modalPopTitle = `${eqpName} ${logicParamName} - ${cellName} (${cellValue})`;

        // Health Index 해당 (LogicChart 용)
        if( data.column === 'healthIndex' ){
            this.modalPopTitle = `Health Index - ${this.modalPopTitle}`;
        }
        // console.log('data.column', data.column);

        // console.log( 'cellClick', data );
        // console.log( 'cellValue', cellValue, typeof cellValue );

        // 모달팝업 타입
        this.modalPopType = chartType;

        //* 차트 데이터 불러오기 (LogicChart)
        if( chartType === 'logicChart' ){
            this.getChartData( logicParamID, <string>columnName, cellValue );
        }
        //* 차트 데이터 불러오기 (TrendChart)
        else if( chartType === 'trendChart' ){

            // health index 관련 logic 번호 찾아내기
            let healthIndexTarget: string = undefined;
            let i: number = 1;
            while( i <= 4 ){
                const keyName = `logic${i}`;
                if( data.row.hasOwnProperty(keyName) && <number>data.row[keyName] === <number>data.row['healthIndex'] ){
                    healthIndexTarget = keyName;
                    break;
                }
                i++;
            }

            // health index 관련 logic이 없을 경우 처리 x
            if( healthIndexTarget === undefined ){ return; }

            // 트랜드 차트 그려질 데이터 세팅
            this.trendEqpId = <number>data.row['eqp_id'];
            this.trendEqpName = eqpName;

            this.trendParamId = <number>data.row[`${healthIndexTarget}Param`];
            this.trendParamName = <string>data.row[`${healthIndexTarget}param_name`];
            this.trendValue = <number>data.row[healthIndexTarget];
            this.trendSpecWarning = <number>data.row['upperAlarmSpec'];

            this.trendPlantId = this.fabId;
            this.trendAreaId = (this.areaId === undefined) ? null : this.areaId;

            this.trendFromDate = this.timePeriod.fromDate;
            this.trendToDate = this.timePeriod.toDate;

            // console.log('healthIndexTarget', healthIndexTarget);
            // console.log('this.chartType', this.chartType );
            // console.log('this.trendParamId', this.trendParamId );
            // console.log('this.trendEqpName', this.trendEqpName );
            // console.log('this.trendParamName', this.trendParamName );
            // console.log('this.trendEqpId', this.trendEqpId);
            // console.log('this.trendPlantId', this.trendPlantId);
            // console.log('this.trendFromDate', this.trendFromDate);
            // console.log('this.trendToDate', this.trendToDate);
            // console.log('this.trendAreaId', this.trendAreaId);
            // console.log('this.trendValue', this.trendValue);
            // console.log('this.trendSpecWarning', this.trendSpecWarning);

            // 팝업창 띄우기
            this.modalPop.open();
        }
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

        // 등록된 이벤트 제거
        if( this.widgetElem !== undefined ){
            this.widgetElem.removeEventListener('transitionend', this.onResize.bind(this));
        }

        this.destroy();
    }

    //* 데이터 가져오기
    getData( configData: IConfigData ): void {
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

            // console.log( 'getListData', res );
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
                    line: row.area_name,
                    equipment: row.eqp_name,
                    healthIndex: Math.floor(row.score*100)/100,
                    logic1: Math.floor(row.logic1*100)/100,
                    logic2: Math.floor(row.logic2*100)/100,
                    logic3: Math.floor(row.logic3*100)/100,
                    logic4: Math.floor(row.logic4*100)/100,
                    logic1Param: row.logic1Param,
                    logic2Param: row.logic2Param,
                    logic3Param: row.logic3Param,
                    logic4Param: row.logic4Param,
                    logic1param_name: row.logic1param_name,
                    logic2param_name: row.logic2param_name,
                    logic3param_name: row.logic3param_name,
                    logic4param_name: row.logic4param_name,
                    upperAlarmSpec: row.upperAlarmSpec,
                    upperWarningSpec: row.upperWarningSpec,
                    alarmCount: row.alarm_count,
                    description: row.description === null ? '' : row.description,
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
    getChartData( logicParamId: number, logicType: string, cellValue: number ): void {

        // logic1 ~ 4의 선택 값이 0이라면 
        if( cellValue === 0 ){
            alert('No Chart Data');
            return;
        }

        this.showSpinner();

        this._service.getChartData({
            logicType: logicType,
            fabId: this.fabId,
            areaId: this.areaId,
            logicParamId: logicParamId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate,
            resultCallback: (res:
                Array<IReqDataFormat_chart_logic1> |
                IReqDataFormat_chart_logic2 | 
                IReqDataFormat_chart_logic3 | 
                IReqDataFormat_chart_logic4
            )=>{
                // console.log( 'getChartData', res );

                const chartData: Array<IReqDataFormat_chart_logic1> = (( logicType === 'logic1' )
                    ? <Array<IReqDataFormat_chart_logic1>> res
                    : <Array<IReqDataFormat_chart_logic1>> res['eqpHealthTrendData']
                );

                // 차트 데이터가 없을 경우 alert
                if( chartData.length === 0 ){
                    alert('No Chart Data');
                } else {
                    // 차트 그리기
                    this.logicChart.setParam( logicType, res, this.timePeriod.fromDate, this.timePeriod.toDate, cellValue );

                    // 팝업창 띄우기
                    this.modalPop.open(); 
                }

                // 로딩 스피너 숨김
                this.hideSpinner();
            },
            errorCallback: (err: any)=>{
                this.hideSpinner();
            }
        });
    }

    //* 해당 표 셀에 피드백 표기
    public tableCellFeedbackPaint(columnIdx: number, e: {data:Array<any>, elements:any}): void {

        // 관련 cell 엘리먼트만 가져오기
        const tableTd: any = $(e.elements).find(`td:nth-child(${columnIdx+1})`);

        // 실제 그려주고 있는 표 데이터
        const datas: Array<any> = e.data;

        // 관련 셀이 개수 가져오기
        const len: number = tableTd.length;
       
        let i: number = 0;
        let targetNum: number;          // 해당 셀 값
        let alarmSpec: number;          // 알람 스펙
        let warningSpec: number;        // 워닝 스펙        

        for( i=0; i<len; i++ ){
            targetNum = parseFloat(tableTd.eq(i).html());
            alarmSpec = datas[i].upperAlarmSpec;
            warningSpec = datas[i].upperWarningSpec;           

            // console.log( 'targetNum', targetNum, typeof targetNum );
            // console.log( 'alarmSpec', alarmSpec );
            // console.log( 'warningSpec', warningSpec );
            // console.log( 'this.listData['+i+']', this.listData[i] );

            // 0.97이상 ~ 1.0미만 값이면 워닝 (주황 배경색)
            if( targetNum >= warningSpec && targetNum < alarmSpec ){
                // tableTd.eq(i).css({backgroundColor:'#ed9622', color:'#fff'});
                tableTd.eq(i).attr('feedback','warning');
            }
            // 1.0이상 알람 (빨강 배경색)
            else if ( targetNum >= alarmSpec ){
                // tableTd.eq(i).css({backgroundColor:'#e8552e', color:'#fff'});
                tableTd.eq(i).attr('feedback','alarm');
            }
            // 기본
            else {
                tableTd.eq(i).attr('feedback','normal');
            }

            // 값이 0 일경우
            if( targetNum === 0 ){
                tableTd.eq(i).attr('zero', '');
            }

            // 엘리먼트 표기용 툴팁
            tableTd.eq(i).attr('title', `Alarm:${alarmSpec}, Warning:${warningSpec}`);
        }
    }

    //* 표 그리기 완료 후, health index 셀 배경색 칠하기
    public drawEnd( e: {data:Array<any>, elements:any} ): void {

        // health index 컬럼 위치 idx에 테이블 cell 배경색 칠하기
        this.tableCellFeedbackPaint( this.getCellIdx('healthIndex'), e );
        this.tableCellFeedbackPaint( this.getCellIdx('logic1'), e );
        this.tableCellFeedbackPaint( this.getCellIdx('logic2'), e );
        this.tableCellFeedbackPaint( this.getCellIdx('logic3'), e );
        this.tableCellFeedbackPaint( this.getCellIdx('logic4'), e );
    }

    //* 리사이 징
    private onResize(): void {
        // ng2table 높이 자동 리사이징 처리
        this.table.setResizeHeight();
    }
}
