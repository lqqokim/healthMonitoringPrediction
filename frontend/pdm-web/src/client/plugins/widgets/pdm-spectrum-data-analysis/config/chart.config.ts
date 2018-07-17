import { WidgetConfigApi } from '../../../../common';

/*******************************************
 * getChartConfig(<info>)를 위젯에서 호출한다.
 *******************************************/
export class SpectrumDataAnalysisChartConfig extends WidgetConfigApi {
    charts: any;
    data: any;
    tooltipFunction: any;
    addWindowFunction: any;

    getChartConfig(info: any):any {
        this.charts = info.charts;
        this.data = info.data;
        this.tooltipFunction = info.tooltipFunction;
        this.addWindowFunction = info.addWindowFunction;
        return {}; //getBistelChartConfig(this.data, this.tooltipFunction, this.addWindowFunction);
    }
}

// function getBistelChartConfig(data: any, tooltipFunction: Function, addWindowFunction: Function) {
//     let series = !(data.construtor !== Array) ? [] : data.map((item: any) => {
//         return {label: item.inlineTool.name};
//     });
//     let retData: any;
//     retData = {
//         cursor : {
//             zoom : true
//         },
//         legend : {
//             _width: 150,
//             show : true,
//         },
//         // seriesColors : chartStyleUtil.getDefaultColor,
//         seriesDefaults : {
//             breakOnNull: true,
//             showLine : true,
//             showLabel : true,
//             showMarker : true,
//             markerOptions : {
//                 show : true,
//                 stroke: false,
//                 style : 'filledCircle',
//                 size : 7
//             }
//         },
//         series : series,
//         highlighter: {
//             showTooltip: true,
//             clickTooltip: true,
//             tooltipContentEditor: function(str:string, seriesIndex:number, pointIndex:number, plot:any, tooltipContentProc:any, ev:any) {
//                 if (ev.type === 'jqplotClick') {
//                     this._tooltipElem.hide();
//                     return;
//                 }
//                 tooltipContentProc(tooltipFunction(str, seriesIndex, pointIndex, plot));
//             },
//             overTooltip: true,
//             overTooltipOptions: {
//                 showMarker: true,
//                 showTooltip: true,
//                 lineOver: false
//             }
//         },
//         axesDefaults: {
//             rendererOptions: {
//                 baselineWidth: 1,
//                 drawBaseline: true
//             }
//         },
//         grid: {
//             background: 'transparent',
//             drawBorder: false,
//             borderColor: '#ccc',
//             gridLineColor: '#ccc',
//             borderWidth: 0,
//         },
//         axes : {
//             yaxis : {
//                 padMin: 1.1,
//                 padMax: 1.1,
//                 autoscale : true,
//                 tickOptions : {
//                     fontSize : '12px',
//                     textColor: '#333333',
//                     //formatString : '%.2f',
//                     formatter: (formatString:string, val:any, plot:any) => {
//                         return (val / 1000).toFixed();
//                     }
//                 },
//                 rendererOptions : {
//                     tickInset : 0,
//                     baselineColor: '#444'
//                 },
//                 label : 'RPT (second)',
//                 labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
//                 labelOptions: {
//                     fontSize:'10pt',
//                     fontFamily: 'arial, sans-serif'
//                 }
//             },
//             xaxis : {
//                 drawMajorGridlines: false,
//                 autoscale : false,
//                 tickOptions : {
//                     fontSize : '12px',
//                     textColor: '#333333',
//                     formatter: function(formatString:string, value:any, plot:any) {
// tslint:disable-next-line:max-line-length
//                         return moment(plot.axes[this.axis].max).format('L') !== moment(plot.axes[this.axis].min).format('L') ? moment(this.value).format('MM/DD HH:mm:ss') : moment(this.value).format('HH:mm:ss');
//                     }
//                 },
//                 rendererOptions: {
//                     dataType: 'date',
//                     baselineColor: '#444'
//                 },
//                 label: 'Date Time',
//                 labelOptions: {
//                     fontSize:'10pt',
//                 }
//             }
//         },
//         eventLine: {
//             show: true,
//             tooltip: {  // default line tooltip options
//                 show: true,         // default : true
//                 adjust: 5,          // right, top move - default : 5
//                 formatter: (value:any) => {
//                     // return moment(value).format('MM/DD HH:mm:ss.SSS');
//                 },
//                 style: '',          // tooltip container style (string or object) - default : empty string
//                 classes: ''         // tooltip container classes - default : empty string
//             },
//             panels: {
//                 bottom: {
//                     show: true,
//                     axis: 'xaxis',
//                     showGridLine: true,
//                     gridLineOptions: {
//                         // show: true,
//                         // color: '#000',
//                         // width: 1,
//                         // adjust: 0,    // 정의한 pixel만큼 짧아짐
//                         // pattern: null,
//                         // shadow: false,
//                         label: {
//                             formatter: (value:any) => {
//                                 // return moment(value).format('MM/DD HH:mm:ss.SSS');
//                             }
//                             // show: true,
//                             // classes: '',
//                             // style: '',
//                             // position: 'n',
//                             // offset: {
//                                 // top: 0,
//                                 // left: 0
//                             // }
//                         }
//                     },
//                     style: {
//                         cursor: 'pointer'
//                     },
//                     actions: {
//                         click: addWindowFunction.bind(this)
//                     }
//                 }
//             },
//             events: [],
//             multiSelect: false
//         }
//     };

//     return retData;
// }

// function findSerieseClickData(data:any, item:any) {
//     let rv:any = null,
//         findData:any = null,
//         targetName:string = item.name,
//         findeDataIndex:number = -1,
//         totalData:Array<any> = [];
//     for( var i = 0; i < data.length; i++ ) {
//         totalData.concat(data[i]);
//         if( data[i][0].name === targetName ) {
//             findeDataIndex = i;
//         }
//     }
//     data[findeDataIndex].forEach((d:any) => {
//         //
//         findData = _.findWhere(d, {name:item.name, inputIdx: ( item.index+1 ) });
//         if(d.inputIdx == (item.index + 1) && d.name == item.name){
//             findData = d;
//         }
//         if (_.isUndefined(findData) === false) {
//             rv = findData;
//             return false;
//         }
//         return true;
//     });
//     return rv;
// }
