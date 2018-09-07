//Request types
export interface RadarEqpReqParams {
    fabId: string | number;
    params: {
        fromDate: number;
        toDate: number;
        radarType?: string;
        numberOfWorst?: number;
    }
}

export interface RadarParamReqParams {
    fabId: string | number;
    eqpId: number;
    params: {
        fromDate: number;
        toDate: number;
    }
}

export interface EqpTraceReqParams {
    fabId: string | number;
    eqpId: number;
    params: {
        fromDate: any;
        toDate: any;
        normalizeType: string;
    }
}


//Response types
export interface RadarEqpRes {
    name: string;
    type: string;
    area_id: number;
    eqpId: number;
    startDtts: number;
}

export interface RadarParamRes {
    alarm: number;
    avgDaily: number;
    avgSpec: number;
    avgWithAW: number;
    cause?: any;
    classifications?: any;
    paramId: number;
    paramName: string;
    readDtts: number;
    userName: number;
    variation: number;
    warn: number;
}

//Type data by type
export interface AlarmWarning {
    eqpName: string; // 장비 이름
    paramName: string; // 파라미터 이름
    duration: number; // 지속 시간
    alarm: number; // 주의선
    warn: number; // 경고선
    type: string;
    avgWithAW: number; // Alarm, Warning을 포함한 평균값
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
    classifications: string | any; // Type에 따른 문제 원인
}

export interface B5Data {
    eqpName: string; // 장비 이름
    paramName: string;// 파라미터 이름
    duration: number; // 지속 시간
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
}

export interface G5Data {
    eqpName: string; // 장비 이름
    paramName: string; // 파라미터 이름
    duration: number; // 지속 시간
    avgDaily: number; // Parameter의 어제 하루 평균값
    avgSpec: number; // Parameter의 90일 평균값
}

//Radar data types
export interface AWRadarData {
    type: string;
    id: Eqp['eqpId'];
    name: Eqp['eqpName'];
    problemreason: string;
    chartData: [Alarm[], Warn[], AvgDaily[], AvgWithAW[]];
    option: RadarOption;
    detail: RadarDetail;

    index?: number;
    areaId?: number;
}

export interface BGRadarData {
    type: string;
    id?: Eqp['eqpId'];
    name: Eqp['eqpName'];
    duration: string;
    detail: RadarDetail;
    chartData: [Alarm[], Warn[], AvgSpec[], AvgDaily[]];
    option: RadarOption;

    index?: number;
    labelColor?: string;
    areaId?: number;
    problemreason?: string;
}

export interface RadarDetail {
    maxParamName: string;
    maxDailyAvg: number;
    maxSpecAvg: number;
    maxAvgWithAW?: number; //AW
    maxAWwithAvg?: number; //AW
    minMaxRatioVariation?: number; //B5; G5
}

export interface RadarOption {
    maxValue: number;
    levels: number;
    ExtraWidthX?: number;
    series: Series[];
    color: Function;
    SelectLabel?: string;
    ShowLabel?: boolean;
    zoom?: number;
}

// export interface RadarChart {
//     alarm: Alarm[];
//     warn: Warn[];
//     avgDaily?: AvgDaily[];
//     avgSpec?: AvgSpec[];
//     avgWithAW?: AvgWithAW[] 
// }

export interface Series {
    fill: boolean;
    circle: boolean;
}

//Condition types
export interface Condition {
    fabId: number;
    timePeriod: TimePeriod;
    maxParamCount: number;
}

export interface TimePeriod {
    from: number;
    to: number;
}

export interface Eqp {
    eqpId: number;
    eqpName: string;
}

export interface RadarType {
    ALARM_WARNING: string;
    GOOD_FIVE: string;
    BAD_FIVE: string;
}

export interface ParamContext {
    selectedItem: AWRadarData | BGRadarData;
    event: Event;

    timePeriod: TimePeriod;
    type: string;
    eqpName: string;
    eqpId: number;
    paramData: AvgWithAW;
    index?: number;
    flag?: string;
}

export interface EqpContext {
    selectedItem: AWRadarData | BGRadarData;
    event: Event;
}

export interface Alarm {
    axis: string;
    value: number;
}

export interface Warn {
    axis: string;
    value: number;
}

export interface AvgSpec {
    axis: string;
    value: number;
}

export interface AvgDaily {
    axis: string;
    value: number;
    data?: RadarParamRes;

    index?:number;
}


export interface AvgWithAW {
    axis: string;
    value: number;
    data: RadarParamRes;

    index?: number;
}

export interface TrendData {
    trendParamId: number;
    trendEqpName: string;
    trendParamName: string;
    trendEqpId: number;
    trendPlantId: number;
    trendFromDate: number;
    trendToDate: number;
    trendAreaId: number;
    trendValue: number;
    trendSpecWarning: number;
    trendChartType: string;
}

export interface Type {
    ALARM: string;
    WARNING: string;
    B5: string;
    G5: string;
    AW: string;
}