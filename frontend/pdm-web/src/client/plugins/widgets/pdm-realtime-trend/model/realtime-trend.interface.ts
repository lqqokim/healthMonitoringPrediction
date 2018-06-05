export interface RealTimeConfigType {
    fabId: string,
    worstTop: number,
    timePeriod: {
        from: any,
        to: any
    }
}

export interface paramDatasType {
    paramId: number;
    paramName: string;
    data: any[]
    eqp?: EqpDataType;
}

export interface AWTraceDataType {
    chartData: any[];
    chartConfig: any;
    eventLines?: any[];
    eqp: EqpDataType;
    type: string;

    alarmSpecs: any[];
    warningSpecs: any[],
    paramNames: string[];
    paramDatas: paramDatasType[];
    option: any;
}

export interface NWTraceDataType {
    chartData: any[];
    chartConfig: any;
    eventLines?: any[];
    eqp: EqpDataType;
    type: string;

    alarmSpecs: any[];
    warningSpecs: any[],
    paramNames: string[];
    paramDatas: paramDatasType[];
    option: any;
}

export interface EqpsRequestParam {
    fabId: string | number;
    params: {
        fromDate: number;
        toDate: number;
        radarType?: string;
        numberOfWorst?: number;
    }
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

export interface EqpDataType {
    area_id: number;
    eqpId: number;
    name: string;
    startDtts: any;
    type: string;
}

export interface TraceDataType {
    eqp_id: number;
    param_id: number;
    alarm_spec: number;
    warning_spec: number;
    param_name: string;
    eqp_name: string;
    datas: any[]
}