import { IChartConfig } from './chart-config';

export class ScatterplotConfig {

    static getDefaultConfig(): any{
        let config: any = {
            "chart" : {
                "margins" : {
                    "left" : 40,
                    "right" : 20,
                    "top" : 5,
                    "bottom" : 10
                },
                "colorList" : (<any>[]),
                "isGuideLine" : {
                    "show" : true,
                    "showXLine" : true,
                    "showYLine" : true,
                    "isShowLineOnXAxis" : true,
                    "isShowLineOnYAxis" : true,
                    "xLineColor" : '#101010',
                    "yLineColor" : '#101010',
                    "lineOpacity" : "0.1"
                },
                "xAxis" : {
                    "refVal" : "causeValue",
                    "orient" : "bottom",
                    "tickPadding" : 5,
                    "className" : 'scatter-plot-xAxis',
                    "labelName" : 'xAxis',
                },
                "yAxis" : {
                    "refVal" : "effectValue",
                    "orient" : "left",
                    "tickPadding" : 2,
                    "className" : 'scatter-plot-yAxis',
                    "labelName" : 'yAxis',
                    "tickFormat" : undefined
                },
                "nodeItem" : {
                    "isShowNodeName" : false,
                    "titleRefVal" : "index",
                    "colorRefVal" : "color",
                    "dotSize" : 3,
                    "dotOpacity" : 0.5,
                    "nodeClassName" : 'scatter-plot-node',
                    "dotClassName" : 'scatter-plot-dot'
                },
                'areas' : {
                    'show': true,
                    'data': undefined
                }
            }
        }
        return config;
    }
}