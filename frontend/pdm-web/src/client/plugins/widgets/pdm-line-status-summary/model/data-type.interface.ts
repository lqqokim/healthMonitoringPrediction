export interface Contition {
    fab: Fab;
    timePeriod: {
        fromDate: number,
        toDate: number
    }
}

export interface Fab {
    fabId: number;
    fabName: string;
}

export interface TimePeriod {
    fromDate: number;
    toDate: number;
}

export interface RequestParams {
    from: number;
    to: number;
}

export interface LineStatusSummary {
    alarm_count: number;
    area_id: number;
    area_name: string;
    end_time: number;
    failure_count: number;
    normal_count: number;
    offline_count: number;
    start_time: number
    total_count: number;
    warning_count: number;
}
