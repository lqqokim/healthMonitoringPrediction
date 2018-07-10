export interface ContitionType {
    fab: Fab;
    timePeriod: {
        fromDate: number,
        toDate: number
    }
}

export interface Fab {
    fabId: string | number;
    fabName: string;
}