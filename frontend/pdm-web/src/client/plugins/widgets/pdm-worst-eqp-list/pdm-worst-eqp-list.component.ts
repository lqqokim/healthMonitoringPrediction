import { Component, ViewEncapsulation, OnDestroy, } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { IWorstEeqList, ITimePeriod } from '../../common/status-chart-canvas/status-change.component';

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
    eqp_name: string;
    eqp_rawid: number,
    score: number,
    area_rawid: number,
    area_name: string,
    datas: Array<{
        type: string;
        start: number;
        end: number;
    }>
}

@Component({
    moduleId: module.id,
    selector: 'pdm-worst-eqp-list',
    templateUrl: 'pdm-worst-eqp-list.html',
    styleUrls: ['pdm-worst-eqp-list.css'],
    providers: [PdmWostEqpListService],
    encapsulation: ViewEncapsulation.None
})

export class PdmWostEqpListComponent extends WidgetApi implements OnSetup, OnDestroy {

    // status 별 색상설정
    drawColors:Array<{name: string; color: string;}> = [
        {name:'Run', color:'#1b6bce'},
        {name:'Normal', color:'#00b050'},
        {name:'Warning', color:'#ffc000'},
        {name:'Alarm', color:'#ff0000'},
        {name:'Failure', color:'#000000'},
        {name:'Offline', color:'#a6a6a6'}
    ];

    // 날짜 범위 (config 값 사용)
    private timePeriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    // 타겟 이름 (초기 기본명 세팅)
    private targetName: string = 'All Lines';

    // worst eqp list 데이터
    private listData: Array<IWorstEeqList> = [];

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
        private _service: PdmWostEqpListService
    ){
        super();
    }

    //* 초기 설정 (로딩, config값 로드)
    ngOnSetup() {
        this.showSpinner();

        this.setConfigData('DAY', undefined, 7);
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
                    order: i+1,
                    equipment: row.eqp_name,
                    score: row.score,
                    status: row.datas
                });
            }
            
            // 임시 세팅용 (서버 요청이 정상 데이터가 전달 된다면 아래 timeperiod 제거)
            this.timePeriod = {
                fromDate: 1527174000000,
                toDate: 1527260400000
            };

            console.log('result', res);
            console.log('this.listData', this.listData);

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            this.timePeriod = {
                fromDate: 1532044800000,
                toDate: 1532077200000
            };

            this.listData = [
                {
                    order: 1,
                    equipment: 'EQP34',
                    score: 0.83,
                    status: [
                        {type: 'Run', start:1532044800000, end:1532051940000 },
                        {type: 'Normal', start:1532051940000, end:1532052000000 },
                        {type: 'Warning', start:1532052000000, end:1532061011000 },
                        {type: 'Alarm', start:1532061011000, end:1532066400000 },
                        {type: 'Failure', start:1532066400000, end:1532073600000 },
                        {type: 'Offline', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 2,
                    equipment: 'EQP51',
                    score: 0.75,
                    status: [
                        {type: 'Normal', start:1532044800000, end:1532046600000 },
                        {type: 'Warning', start:1532046600000, end:1532057820000 },
                        {type: 'Alarm', start:1532057820000, end:1532059200000 },
                        {type: 'Offline', start:1532059200000, end:1532062500000 },
                        {type: 'Failure', start:1532062500000, end:1532062800000 },
                        {type: 'Run', start:1532062800000, end:1532077200000 }
                    ]
                }, {
                    order: 3,
                    equipment: 'EQP34',
                    score: 0.72,
                    status: [
                        {type: 'Run', start:1532044800000, end:1532051940000 },
                        {type: 'Normal', start:1532051940000, end:1532052000000 },
                        {type: 'Warning', start:1532052000000, end:1532061011000 },
                        {type: 'Alarm', start:1532061011000, end:1532066400000 },
                        {type: 'Failure', start:1532066400000, end:1532073600000 },
                        {type: 'Offline', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 4,
                    equipment: 'EQP34',
                    score: 0.69,
                    status: [
                        {type: 'Alarm', start:1532044800000, end:1532045530500 },
                        {type: 'Run', start:1532045530500, end:1532056200000 },
                        {type: 'Warning', start:1532056200000, end:1532061011000 },
                        {type: 'Offline', start:1532061011000, end:1532077200000 }
                    ]
                }, {
                    order: 5,
                    equipment: 'EQP34',
                    score: 0.66,
                    status: [
                        {type: 'Run', start:1532044800000, end:1532051940000 },
                        {type: 'Normal', start:1532051940000, end:1532052000000 },
                        {type: 'Warning', start:1532052000000, end:1532061011000 },
                        {type: 'Alarm', start:1532061011000, end:1532066400000 },
                        {type: 'Failure', start:1532066400000, end:1532073600000 },
                        {type: 'Offline', start:1532073600000, end:1532077200000 }
                    ]
                }
            ];
            console.log('err', err);
            console.log('this.listData', this.listData);
            this.hideSpinner();
        });
    }
}
