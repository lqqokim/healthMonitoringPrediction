import { Component, ViewEncapsulation, OnDestroy, } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { IWorstEeqList, ITimePeriod } from '../../common/status-chart-canvas/status-change.component';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';

// 서버 요청 데이터 포맷
export interface IReqDataFormat {
    eqp_name: string;
    eqp_rawid: number,
    score: number,
    area_rawid: number,
    area_name: string,
    datas: Array<{
        status: string;
        start_dtts: number;
        end_dtts: number;
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
        {name:'RUN', color:'#00b050'},
        // {name:'Normal', color:'#00b050'},
        // {name:'Warning', color:'#ffc000'},
        // {name:'Alarm', color:'#ff0000'},
        // {name:'Failure', color:'#000000'},
        {name:'IDLE', color:'#a6a6a6'}
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

    // 위젯 컨피그 헬퍼
    private confgHelper: WidgetConfigHelper;
    
    constructor(
        private _service: PdmWostEqpListService
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

    //* 데이터 가져오기
    getData( configData: IConfigData ){
        // 헬퍼를 통해 넘어온 값 설정
        this.fabId = configData.fabId;
        this.targetName = configData.targetName;
        this.timePeriod = configData.timePeriod;

        console.log( this.timePeriod );
        
        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: 1530802800000, //this.timePeriod.fromDate,
            toDate: 1530889200000 //this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            let i: number, j: number,
                max: number = res.length,
                row: IReqDataFormat
            ; 

            for( i=0; i<max; i++ ){
                row = res[i];
                this.listData.push({
                    order: i+1,
                    equipment: row.eqp_name,
                    score: row.score,
                    status: []
                });
                for( j=0; j<row.datas.length; j++ ){
                    this.listData[i].status.push({
                        type: row.datas[j].status,
                        start: row.datas[j].start_dtts,
                        end: row.datas[j].end_dtts
                    });
                }
            }
            
            // 임시 세팅용 (차트 그려주기 위한 데이터 이기 때문에 임시 설정) (서버 요청이 정상 데이터가 전달 된다면 아래 timeperiod 제거)
            this.timePeriod = {
                fromDate: 1530802800000,
                toDate: 1530889200000
            };

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
                        {type: 'RUN', start:1532044800000, end:1532051940000 },
                        {type: 'IDLE', start:1532051940000, end:1532052000000 },
                        {type: 'RUN', start:1532052000000, end:1532061011000 },
                        {type: 'RUN', start:1532061011000, end:1532066400000 },
                        {type: 'IDLE', start:1532066400000, end:1532073600000 },
                        {type: 'RUN', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 2,
                    equipment: 'EQP51',
                    score: 0.75,
                    status: [
                        {type: 'IDLE', start:1532044800000, end:1532046600000 },
                        {type: 'RUN', start:1532046600000, end:1532057820000 },
                        {type: 'RUN', start:1532057820000, end:1532059200000 },
                        {type: 'RUN', start:1532059200000, end:1532062500000 },
                        {type: 'RUN', start:1532062500000, end:1532062800000 },
                        {type: 'IDLE', start:1532062800000, end:1532077200000 }
                    ]
                }, {
                    order: 3,
                    equipment: 'EQP34',
                    score: 0.72,
                    status: [
                        {type: 'RUN', start:1532044800000, end:1532051940000 },
                        {type: 'RUN', start:1532051940000, end:1532052000000 },
                        {type: 'RUN', start:1532052000000, end:1532061011000 },
                        {type: 'RUN', start:1532061011000, end:1532066400000 },
                        {type: 'RUN', start:1532066400000, end:1532073600000 },
                        {type: 'RUN', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 4,
                    equipment: 'EQP34',
                    score: 0.69,
                    status: [
                        {type: 'RUN', start:1532044800000, end:1532045530500 },
                        {type: 'IDLE', start:1532045530500, end:1532056200000 },
                        {type: 'RUN', start:1532056200000, end:1532061011000 },
                        {type: 'RUN', start:1532061011000, end:1532077200000 }
                    ]
                }, {
                    order: 5,
                    equipment: 'EQP34',
                    score: 0.66,
                    status: [
                        {type: 'IDLE', start:1532044800000, end:1532051940000 },
                        {type: 'RUN', start:1532051940000, end:1532052000000 },
                        {type: 'RUN', start:1532052000000, end:1532061011000 },
                        {type: 'IDLE', start:1532061011000, end:1532066400000 },
                        {type: 'RUN', start:1532066400000, end:1532073600000 },
                        {type: 'RUN', start:1532073600000, end:1532077200000 }
                    ]
                }
            ];
            console.log('err', err);
            console.log('this.listData', this.listData);
            this.hideSpinner();
        });
    }
}
