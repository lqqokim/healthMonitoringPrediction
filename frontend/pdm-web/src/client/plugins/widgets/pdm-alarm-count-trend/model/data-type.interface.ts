export interface ContitionType {
    fab: Fab;
    area?: Area;
    timePeriod: {
        from: number,
        to: number
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