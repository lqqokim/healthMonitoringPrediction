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

export interface TimePeriod {
    fromDate: number;
    toDate: number;
}

export interface RequestParam {
    from: number;
    to: number;
}

export interface AlarmCountTrend {
    alarm_count: number;
    area_id: number;
    area_name: string;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
    day: string;
}