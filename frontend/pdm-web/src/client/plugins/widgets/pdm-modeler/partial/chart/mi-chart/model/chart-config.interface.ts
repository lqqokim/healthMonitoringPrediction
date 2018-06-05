/**
 * Created by airnold on 2017. 7. 10..
 */


export module SeriesType {
    export class SeriesTypes {
        static COLUMN_SERIES: string = 'ColumnSeries';
        static COLUMN_SET: string = 'ColumnSet';
        static BAR_SERIES: string = 'BarSeries';
        static BAR_SET: string = 'BarSet';
        static PIE_SERIES: string = 'PieSeries';
        static PIE_SET: string = 'PieSet';
        static LINE_SERIES: string = 'LineSeries';
    }

    export class SetTypes {
        static STACKED_SET: string = 'stacked';
        static GROUP_SET: string = 'group';
    }

    export class SeriesLabelFormat {
        static BASE: Function = function(d: any) {return d;};
        static DOLLAR: Function = function(d: any) {return d+'$';};
        static PERCENT: Function = function(d: any) {return d+'%';};
    }
}

export module AxisType {
    export class AxisTypes {
        static NUMERIC_AXIS: string = 'NumericAxis';
        static DATETIME_AXIS: string = 'DateTimeAxis';
        static CATEGORY_AXIS: string = 'CategoryAxis';
    }

    export class AxisOrients {
        static TOP: string = 'top';
        static BOTTOM: string = 'bottom';
        static LEFT: string = 'left';
        static RIGHT: string = 'right';
    }
}

export module  PluginType {
    export class PluginTypes {
        static DRAG_BASE: string = 'DragBase';
    }

    export class PluginDirection {
        static HORIZONTAL: string = 'horizontal';
        static VERTICAL: string = 'vertival';
        static BOTH: string = 'both';
    }
}
