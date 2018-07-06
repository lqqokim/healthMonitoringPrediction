import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmAlarmHistoryService } from './pdm-alarm-history.service';
import { TableData } from '../../common/ng2-table/table.component';
import { ITimePeriod } from '../../common/widget-chart-condition/widget-chart-condition.component';

// 새로 고침 시 사용될 interface
export interface IPrevData {
    fabId: string;
    targetName: string;
    timePeriod: ITimePeriod;
    dayPeriod: number;
    cutoffType: string;
}

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
    selector: 'pdm-alarm-history',
    templateUrl: 'pdm-alarm-history.html',
    styleUrls: ['pdm-alarm-history.css'],
    providers: [PdmAlarmHistoryService],
    encapsulation: ViewEncapsulation.None
})

export class PdmAlarmHistoryComponent extends WidgetApi implements OnSetup, OnDestroy {

    public columns: Array<TableData> = [
        {title: 'Time', name: 'Time' },
        {title: 'EQP', name: 'EQP'},
        {title: 'Param', name: 'Param'},
        {title: 'Category', name: 'Category'},
        {title: 'Fault Class', name: 'FaultClass'}
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

    // 위젯 새로고침 시 되돌릴 데이터 값
    private prevData: IPrevData = {
        fabId: '',
        targetName: '',
        timePeriod: {
            fromDate: 0,
            toDate: 0
        },
        dayPeriod: 0,
        cutoffType: ''
    };
    
    constructor(
        private _service: PdmAlarmHistoryService
    ){
        super();
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();

        this.setConfigData('DAY', undefined, 1);
        this.setConfigInfo('init', this.getProperties());
    }

    //* 자동 prev day 계산
    getTodayPrevDayCalc( day: number ): ITimePeriod {
        const now = new Date();
        const calcDay = 1000 * 60 * 60 * 24 * day;
        const to = new Date( now.getFullYear(), now.getMonth()+1, now.getDate() ).getTime();
        const from = new Date( to - calcDay ).getTime();

        return {
            fromDate: from,
            toDate: to
        };
    }

    //* 위젯 컨피그 속성 값 설정
    setConfigData( type: string, timePeriod: ITimePeriod, dayPeriod: number ){

        const cutoffType: string = type === 'DATE' ? 'DATE' : 'DAY';
        const time: ITimePeriod = (type === 'DAY' ? this.getTodayPrevDayCalc( dayPeriod ) : timePeriod);

        // 컨피스 radio 값 설정 (DAY-Previous day, DATE-Date Range)
        this.setProp('cutoffType', cutoffType);

        // 일별 자동 계산
        if( cutoffType === 'DAY' ){
            this.setProp('dayPeriod', dayPeriod);
        } else {
            this.setProp('dayPeriod', '');
        }

        // 날짜 설정
        // this.setProp('timePeriod', time);
        this.setProp('from', moment(time.fromDate).format('YYYY/MM/DD HH:mm:ss'));
        this.setProp('to', moment(time.toDate).format('YYYY/MM/DD HH:mm:ss'));
    }

    //* 컨피그 설정
    setConfigInfo( type: string, syncData?: any ): void {

        // 새로고침 (이전 컨피그 상태로 되돌림)
        if( type === A3_WIDGET.JUST_REFRESH ){
            this.fabId = this.prevData.fabId;
            this.timePeriod = this.prevData.timePeriod;
            this.targetName = this.prevData.targetName;
            this.areaId = undefined;

            if( this.prevData.cutoffType === 'DAY' ){
                this.setConfigData('DAY', undefined, this.prevData.dayPeriod );
            } else {
                this.setConfigData('DATE', this.timePeriod, undefined );
            }
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
                targetName: this.targetName,
                dayPeriod: this.getProp('dayPeriod'),
                cutoffType: this.getProp('cutoffType')
            };
        }
        // 다른 위젯 데이터 싱크
        else if( type === A3_WIDGET.SYNC_INCONDITION_REFRESH ){
            this.targetName = syncData[CD.AREA][CD.AREA_NAME];
            this.areaId = syncData[CD.AREA][CD.AREA_ID];
            this.timePeriod.fromDate = syncData[CD.TIME_PERIOD].from;
            this.timePeriod.toDate = syncData[CD.TIME_PERIOD].to;

            // 실크 될 실제 컨피그 값 설정 (DATE 기준)
            // this.setConfigData('DATE', this.timePeriod, undefined );
        }

        // 데이터 요청
        this.getData();
    }

    //* APPLY_CONFIG_REFRESH-config 설정 값, JUST_REFRESH-현 위젯 새로고침, SYNC_INCONDITION_REFRESH-위젯 Sync
    refresh({ type, data }: WidgetRefreshType) {

        // 처리할 타입만 필터링
        if( type === A3_WIDGET.JUST_REFRESH ||
            type === A3_WIDGET.APPLY_CONFIG_REFRESH ||
            type === A3_WIDGET.SYNC_INCONDITION_REFRESH ){
            return;
        }

        this.showSpinner();
        this.setConfigInfo( type, data );
    }

    ngOnDestroy() {
        this.destroy();
    }

    //* 데이터 가져오기
    getData(){
        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
            console.log(res);
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

            console.log( 'this.listData', this.listData );

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            this.listData = [
                {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'Unbalance'},
                {Time: '', EQP:'EQP36', Param:'Temp', Category:'Alarm', FaultClass: 'N/A'},
                {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A'},
                {Time: '', EQP:'EQP34', Param:'Pressure', Category:'Warning', FaultClass: 'N/A'},
                {Time: '', EQP:'EQP34', Param:'Vibration1', Category:'Alarm', FaultClass: 'N/A'},
            ];

            console.log('err', err);
            console.log('this.listData', this.listData);
            this.hideSpinner();
        });
    }
}
