export interface SeriesConfiguration {
    condition: SeriesConditions;
    margin: any;
    target?: any;
    type: any;
    plugin?: any;
}

export interface SeriesConditions {
    xField: string;
    yField: string;
    displayName: string;
    displayKey?: string;
    visible: boolean;
    textLabel: {
        show: boolean,
        format: any
    };
    label?: {
        visible: boolean,
        side: string
    };
    circle?: {
        fill?: {
            start: any,
            end: any,
            base: string
        }
    };
    imgData?: any;
}

export interface AxisConfiguration {
    conditions: AxisConditions;
    target?: any;
    margin: any;
    width: number;
    height: number;
    domain?: Array<any>;
    data?: Array<any>;
    isStacked: boolean;
}

export interface AxisConditions {
    field: string;
    format: any;
    visible: boolean;
    gridline: boolean;
    title: string;
    type: string;
    orient: string;
    tickInfo?: any;
}


