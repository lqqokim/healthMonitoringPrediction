import { IChartConfig } from './chart-config';

export class BoxplotConfig {

    static getDefaultConfig(): any{
        let config: any = {
            'bindto': '#chart',
            'size_width': 500,
            'size_height': 350,
            'style_backgroundClassName': 'bistel-boxplot-background',
            'style_mainChartName': 'bistel-boxplot',
            'style_boxstyleName': 'bistel-boxplot-box',
            'style_xaxisStyleName': 'bistel-boxplot-xaxis',
            'style_yaxisStyleName': 'bistel-boxplot-yaxis',
            'style_xaxisTextClass': 'bistel-boxplot-yaxis-label',
            'style_yaxisTextClass': 'bistel-boxplot-yaxis-label',
            'xField': 'series',
            //'yAxisFormat': formatter.secondsFromMilli,
            'yAxisLabelPostion': 'middle',                    //'normal', 'middle'
            'yLabel': 'RPT (second)',
            'xLabel': 'Cluster',
            'labels': false,
            'clickFn': undefined,
            'zoomMinCount': 10,
            'data': undefined
        }
        return config;
    }
}