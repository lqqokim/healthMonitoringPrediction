export interface Response {
    correlationOutput: Array<Array<number>>;
    paramNames: Array<string>;
    paramSeq: Array<number>;

    correlationInput: null;
    correlationScatter: Array<Array<number>>;
    correlationTrend: Array<Array<number>>;
    regression: {
        end_xValue: number;
        end_yValue: number;
        intercept: number;
        r2: number;
        slope: number;
        start_xValue: number;
        start_yValue: number;
    };
}