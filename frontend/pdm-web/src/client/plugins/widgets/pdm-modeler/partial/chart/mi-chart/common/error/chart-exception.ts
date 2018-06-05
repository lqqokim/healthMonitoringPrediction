import { ChartError } from './chart-error.interface';

export class ChartException implements ChartError {
    status: number;
    errorContent: any;
    constructor(status: number, errorContent: any) {
        this.status = status;
        this.errorContent = errorContent;
    }
}
