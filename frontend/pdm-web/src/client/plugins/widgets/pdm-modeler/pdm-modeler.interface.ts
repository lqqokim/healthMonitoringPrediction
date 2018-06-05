export interface AnalysisAandBRequestParam {
    fab: string;
    a_fromdate: number;
    a_todate: number;
    b_fromdate: number;
    b_todate: number;
    params: {
        model: any;
        datas: any;
    }

}

export interface ChartAnalysisRequestParam {
    fromdate: number;
    todate: number;
    charttype: string;
    dataId: string;
    fab: string;
    width: number;
    height: number;
    params: {
        parameters: any;
    }
}

export interface OutlierRequestParam {
    fab: string;
    fromdate: number;
    todate: number;
    charttype: string;
    outliertype: string;
    width: number;
    height: number;
    startX: any;
    endX: any;
    startY: any;
    endY: any;
    dataId: string;
    params: {
        parameters: any;
    }
}

export interface AnalysisDataRequestParam {
    fab: string;
    eqpid: string | number;
    fromdate: number | Date;
    todate: number | Date;
}

export interface BuildAndHealthDataRequestParam {
    fab: string;
    eqpId: string;
    fromdate : number;
    todate: number;
    width: number;
    height: number;
    dataId: string;
    params: {
        parameters: any;
    }
}

export interface SaveEqpRequestParam {
    fab: string;
    eqpid: number | string;
    guid: number | string;
}

export interface DeleteEqpRequestParam {
    eqpid: number| string;
}

export interface PcaDataRequestParam {
    fab: string;
    a_fromdate: number;
    a_todate: number;
    b_fromdate: number;
    b_todate: number;
    dataId: string;
}

export interface HealthModelRequestParam {
    eqpId: string;
    fab: string;
}

export interface ContextMenuDataType {
    uid: string | number;
    date: Array<any>;
    type?: string;
    ruid: string | number
}

export interface TimePeriod {
    from: number ;
    to: number ;
}

export interface HealthIndexZoomRequestParam {
    fab: string;
    fromdate: number;
    todate: number;
    charttype: string;
    width: number;
    height: number;
    dataId: string;
    params: {
        parameters: any;
    };
}

export interface HealthByDataRequestParam {
    fab: string;
    eqpId: string;
    fromdate: number;
    todate: number;
    charttype: string;
    width: number;
    height: number;
    dataId: string;
}
