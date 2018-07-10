export interface ContitionType {
    fab: Fab;
    area?: Area;
    timePeriod: {
        fromDate: number,
        toDate: number
    }
}

export interface Fab {
    fabId: string | number;
    fabName: string;
}

export interface Area {
    areaId: string | number;
    areaName: string;
}