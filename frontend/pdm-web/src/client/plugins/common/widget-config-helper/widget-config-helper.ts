import { ITimePeriod } from "../widget-chart-condition/widget-chart-condition.component";
import { WidgetApi } from "../../../common";

// 새로 고침 시 사용될 interface
export interface IPrevData {
    fabId: string;
    targetName: string;
    timePeriod: ITimePeriod;
    dayPeriod: number;
    cutoffType: string;
}

// 컨피그 설정 데이터
export interface IConfigData {
    fabId: string;
    targetName: string;
    timePeriod: ITimePeriod;
    areaId:number;
}

export class WidgetConfigHelper {
    // 참고할 위젯 설정 용
    private widget: WidgetApi;

    // 데이터 요청 콜백함수
    private dataCallback: Function;

    // 날짜 범위 (config 값 사용)
    private timePeriod: ITimePeriod = {
        fromDate: 0,
        toDate: 0
    };

    // 타겟 이름 (초기 기본명 세팅)
    private targetName: string = 'All Lines';

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
        targetWidget: WidgetApi,
        callback: Function
    ){
        this.widget = targetWidget;
        this.dataCallback = callback;
    }

    //* 자동 prev day 계산
    getTodayPrevDayCalc( day: number, setDate?: number ): ITimePeriod {
        const now = (setDate !== undefined) ? new Date(setDate) : new Date();
        const calcDay = 1000 * 60 * 60 * 24 * day;
        const to = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 0, 0 ,0 ).getTime();
        const from = new Date( to - calcDay ).getTime();

        return {
            fromDate: from,
            toDate: to
        };
    }

    //* 위젯 컨피그 속성 값 설정
    setConfigData( type: string, timePeriod: ITimePeriod, dayPeriod: number ){

        // const cutoffType: string = type === 'DATE' ? 'DATE' : 'DAY';
        // const time: ITimePeriod = (type === 'DAY' ? this.getTodayPrevDayCalc( dayPeriod ) : timePeriod);

        // // 컨피스 radio 값 설정 (DAY-Previous day, DATE-Date Range)
        // this.widget.setProp('cutoffType', cutoffType);

        // // 일별 자동 계산
        // if( cutoffType === 'DAY' ){
        //     this.widget.setProp('dayPeriod', dayPeriod);
        // } else {
        //     this.widget.setProp('dayPeriod', '');
        // }

        // 날짜 설정
        // this.setProp('timePeriod', time);
        // this.setProp('from', moment(time.fromDate).format('YYYY/MM/DD HH:mm:ss'));
        // this.setProp('to', moment(time.toDate).format('YYYY/MM/DD HH:mm:ss'));
    }

    //* 컨피그 설정
    setConfigInfo( type: string, syncData?: any ): void {

        // console.log( 'setConfigInfo', type, this.widget.getProp('cutoffType'), this.widget.getProp('dayPeriod'), syncData );
        
        // 새로고침 (이전 컨피그 상태로 되돌림)
        if( type === A3_WIDGET.JUST_REFRESH ){
            this.fabId = this.prevData.fabId;
            this.timePeriod = JSON.parse(JSON.stringify(this.prevData.timePeriod));
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
            const cutoffType: string = this.widget.getProp('cutoffType');
            const dayPeriod: number = this.widget.getProp('dayPeriod');

            this.fabId = syncData.plant.fabId;
            const configTime:{from:number, to:number} = this.widget.getProp('timePeriod');
            this.areaId = undefined;

            // DAY로 넘어오면 시간 년월일만 남기고 적용 (2018/07.02 12:30:11 → 2018/07/02 00:00:00 )
            if( cutoffType === 'DAY' ){
                this.timePeriod = this.getTodayPrevDayCalc( dayPeriod, configTime.to );
            } else {
                this.timePeriod = {
                    fromDate: configTime.from,
                    toDate: configTime.to
                };
            }

            // 초기 설정 저장용
            // if( type === 'init' ){
                this.prevData = {
                    fabId: this.fabId,
                    timePeriod: JSON.parse(JSON.stringify(this.timePeriod)),
                    targetName: this.targetName,
                    dayPeriod: dayPeriod,
                    cutoffType: cutoffType
                };
            // }
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
        this.dataCallback({
            fabId: this.fabId,
            targetName: this.targetName,
            timePeriod: this.timePeriod,
            areaId:this.areaId
        });
    }
};