export interface Ng2NoUiSliderInterface {
    start: Array<number> | number;
    range: any;
    connect?: Array<boolean> | boolean;
    behaviour?: string;
    margin?: number;
    limit?: number; // limit size is maximum distance two handles
    padding?: number;
    step?: number;
    orientation?: string; // horizontal or vertical
    direction?: string; // ltr or rtl
    tooltips?: Array<boolean> | Array<any> | boolean;
    animate?: boolean;
    animationDuration?: number;
    slideEvent?: Array<Ng2NoUiSliderEventInterface>;
    pips?: Ng2NoUiSliderPipsInterface;
    format?: any;
}

export interface Ng2NoUiSliderEventInterface {
    eventName: string;
    // values: Array<any>, handle: number, unencoded: Array<any>, tap: boolean, positions: Array<any>
    uiSlideCallback(values: Array<any>, handle: number, unencoded: Array<any>, tap: boolean, positions: Array<any>): void;
}

export interface Ng2NoUiSliderPipsInterface {
    mode: string;
    density: number;
    filter?: Function;
    format?: any; // {to: function, from: type}
    values?: Array<any>;
    stepped?: boolean;
}
