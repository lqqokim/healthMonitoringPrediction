export interface Contition {
    fab: Fab;
    area?: Area;
    timePeriod: {
        fromDate: number,
        toDate: number
    }
}

export interface Fab {
    fabId: number;
    fabName: string;
}

export interface Area {
    areaId: number;
    areaName: string;
}

export interface RequestParams {
    from: number;
    to: number;
}

export interface LineStatusTrend {
    alarm_count: number;
    area_id: number;
    area_name: string;
    day: string;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
}

export interface TimePeriod {
    fromDate: number;
    toDate: number;
}

export interface RequestParams {
    from: number;
    to: number;
}