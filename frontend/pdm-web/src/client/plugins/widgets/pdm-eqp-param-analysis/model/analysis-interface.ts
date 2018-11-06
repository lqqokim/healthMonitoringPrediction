export interface Fab {
    fabId: number | string;
    fabName: string;
}

export interface TimePeriod {
    from: number;
    to: number;
}

export interface ChartConfig {
    legend?: Object;
    eventLine?: Object;
    seriesDefaults?: Object;
    axes?: Object
    series?: any[],
    seriesColors?: any;
    highlighter?: Object
};

export interface ChartEventConfig {
    jqplotDataClick?: Function;
    jqplotDblClick?: Function;
}

export interface Props {
    analysisSpec: number;
    analysisSpecVisible: boolean;
    areaId: number;
    communication: { widgets: any }
    cutoffType: string;
    dayPeriod: number;
    dayPeriod30: number;
    plant: Fab
    timePeriod: TimePeriod
}