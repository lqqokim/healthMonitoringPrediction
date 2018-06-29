export interface RadarEqpsRequestParam {
    fabId: string | number;
    params: {
        fromDate: number;
        toDate: number;
        radarType?: string;
        numberOfWorst?: number;
    }
}

export interface RadarParamsRequestParam {
    fabId: string | number;
    eqpId: number;
    params: {
        fromDate: number;
        toDate: number;
    }
}

export interface AlarmWarningDataType {
    eqpName: string; // 장비 이름
    paramName: string; // 파라미터 이름
    duration: number; // 지속 시간
    alarm: number; // 주의선
    warn: number; // 경고선
    type: string;
    avgWithAW: number; // Alarm, Warning을 포함한 평균값
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
    classifications: string | any; // Type에 따른 원인
}

export interface B5DataType {
    eqpName: string; // 장비 이름
    paramName: string;// 파라미터 이름
    duration: number; // 지속 시간
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
}

export interface G5DataType {
    eqpName: string; // 장비 이름
    paramName: string; // 파라미터 이름
    duration: number; // 지속 시간
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
}

export interface RadarWidgetConfigType {
    fabId: number;
    timePeriod: any;
}

export interface RadarType {
    ALARM_WARNING: string;
    GOOD_FIVE: string;
    BAD_FIVE: string;
}

export interface EqpTraceRequestParam {
    fabId: string | number;
    eqpId: number;
    params: {
        fromDate: any;
        toDate: any;
        normalizeType: string;
    }
}

export interface ChartDataType {
    type: string;
    id: string | number;
    name: string;
    duration?: string;
    problemreason?: string;
    details: Object;
    chartData: DataType
    options: Object;
    labelColor?: string;
    areaId?: string | number;
    isExpand?: boolean
}

export interface DataType{
    alarms: any[];
    warns: any[];
    avgWithAWs?: any[];
    avgDailys: any[];
    avgSpecs?: any[];
}