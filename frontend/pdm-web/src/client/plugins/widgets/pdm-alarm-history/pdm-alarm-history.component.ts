import { Component, ViewEncapsulation, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { PdmAlarmHistoryService } from './pdm-alarm-history.service';
import { TableData, TableComponent } from '../../common/ng2-table/table.component';
import { ITimePeriod, WidgetChartConditionComponent } from '../../common/widget-chart-condition/widget-chart-condition.component';
import { WidgetConfigHelper, IConfigData } from '../../common/widget-config-helper/widget-config-helper';

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

    @ViewChild('condition') condition: WidgetChartConditionComponent;
    @ViewChild('tableList') tableList: TableComponent;

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

    // 전체 필터 숨기기
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

    // 리사이즈 용    
    private currElem: ElementRef['nativeElement'] = undefined;
    private widgetElem: ElementRef['nativeElement'] = undefined;
    
    constructor(
        private _service: PdmAlarmHistoryService,
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
    getData( configData: IConfigData ){
        // 헬퍼를 통해 넘어온 값 설정
        this.fabId = configData.fabId;
        this.targetName = configData.targetName;
        this.timePeriod = configData.timePeriod;
        this.areaId = configData.areaId;

        // 타임 출력
        this.condition.timeConvert( this.timePeriod );

        this._service.getListData({
            fabId: this.fabId,
            areaId: this.areaId,
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
        }).then((res: Array<IReqDataFormat>)=>{
            // console.log('resLen',res.length);

            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            let i: number,
                max: number = res.length,
                row: IReqDataFormat,
                tmpList: Array<any> = []
            ; 

            for( i=0; i<max; i++ ){
                row = res[i];
                tmpList[i] = {
                    Time: ((dtts: number)=>{
                        const millisecond: any = moment(dtts).milliseconds();
                        return `${moment(dtts).format('YYYY-MM-DD HH:mm:ss')}.${millisecond}`;
                    })(row.alarm_dtts),
                    EQP: row.eqp_name,
                    Param: row.param_name,
                    Category: row.category,
                    FaultClass: row.fault_class
                };
            }

            this.listData = tmpList;

            this.hideSpinner();
        },(err: any)=>{
            console.log('err', err);
            this.hideSpinner();
        });
    }

    //* 리사이 징
    private onResize(): void {

        // ng2table 높이 자동 리사이징 처리
        this.tableList.setResizeHeight();
    }
}
