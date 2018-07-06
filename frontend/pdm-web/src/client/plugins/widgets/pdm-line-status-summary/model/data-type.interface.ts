export interface ContitionType {
    fab: Fab;
    timePeriod: {
        from: number,
        to: number
    }
}

export interface Fab {
    fabId: string | number;
    fabName: string;
}