import { Component, ViewEncapsulation, OnDestroy, ViewChild, } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { IWorstEeqList, ITimePeriod } from '../../common/status-chart-canvas/status-change.component';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';
import { WidgetChartConditionComponent } from '../../common/widget-chart-condition/widget-chart-condition.component';

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

    @ViewChild('condition') condition: WidgetChartConditionComponent;

    // status 별 색상설정
    drawColors:Array<{name: string; color: string;}> = [
        {name:'RUN', color:'#00b050'},
        // {name:'Normal', color:'#00b050'},
        // {name:'Warning', color:'#ffc000'},
        // {name:'Alarm', color:'#ff0000'},
        // {name:'Failure', color:'#000000'},
        {name:'IDLE', color:'#ff9'},
        {name:'NODATA', color:'#b2b2b2'}
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
        this.areaId = configData.areaId;

        // 타임 출력
        this.condition.timeConvert( this.timePeriod );

        // 임시 목업 데이터 (18.7.6 00:00:00 ~ 18.7.7 00:00:00 테스트 시간)
        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
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
                    score: Math.floor(row.score*100)/100,
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

            this.hideSpinner();
        },(err: any)=>{
            console.log('err', err);
            this.hideSpinner();
        });
    }
}
