
import { Component, ViewChild, ElementRef, OnInit, EventEmitter, Output, Input,ChangeDetectorRef, OnChanges, DoCheck,SimpleChange ,ViewEncapsulation} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
    moduleId: module.id,
    selector: 'summary-trend-chart',
    templateUrl: `summary-trend-chart.html`,
    styleUrls: [`summary-trend-chart.css`],
    encapsulation: ViewEncapsulation.None

})
export class SummaryTrendChartComponent implements OnInit, OnChanges, DoCheck {

    @Input() params;
    @Input() xMin;
    @Input() xMax;

    selectedParam;
    // params = [
    //     { name: 'param1', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param2', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param3', isEventParam: false, conditionValue: null, datas: [] ,eventConfig:[]}
    // ]
    events = [

    ];
    statusEventConfig = [];

    sort={parameter:'none',adHoc:'none'};

    trendConfig: any = {
        legend: {
            show: false,
        },
        eventLine: {
            show: true,
            tooltip: {  // default line tooltip options
                show: false,         // default : true
                adjust: 5,          // right, top move - default : 5
                formatter: null,    // content formatting callback (must return content) - default : true
                style: '',          // tooltip container style (string or object) - default : empty string
                classes: ''         // tooltip container classes - default : empty string
            },
            events: [

            ]
        },
        seriesDefaults: {
            showMarker: false
        },
        axes: {
            xaxis: {
                // min: this.searchTimePeriod[CD.FROM],
                // max: this.searchTimePeriod[CD.TO],
                autoscale: true,
                tickOptions: {
                    showGridline: false,
                    formatter: (pattern: any, val: number, plot: any) => {
                        return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
                    }
                },
                rendererOptions: {
                    dataType: 'date'
                }
            },
            yaxis: {
                drawMajorGridlines: true,
                labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                tickOptions: {
                    showGridline: false,
                    formatString: '%.2f'
                }
            }
        },
        highlighter: {
            isMultiTooltip: false,
            clearTooltipOnClickOutside: false,
            overTooltip: true,
            overTooltipOptions: {
                showMarker: true,
                showTooltip: true,
                lineOver: false
            },
            // size: 2,
            sizeAdjust: 8.3,
            stroke: true,
            strokeStyle: '#acafaa',
            // tslint:disable-next-line:max-line-length
            tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                tooltipContentProc( moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
            },
        }
    };

    eventConfig = {
        jqplotDblClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
            console.log(ev);
        },
        jqplotZoom: (ev, gridpos, datapos, plot, cursor)=>{
            var plotData = plot.series[0].data;

            this.trendConfig['axes']['xaxis']['min'] = plot.axes.xaxis.min;
            this.trendConfig['axes']['xaxis']['max'] = plot.axes.xaxis.max;

            this.trendConfig = Object.assign({},this.trendConfig);

            this._chRef.detectChanges();
            // for(let i=0;i<this.params.length;i++){
            //     this.params.eventConfig.axes.xaxis['min'] = plot.axes.xaxis.min;
            //     this.params.eventConfig.axes.xaxis['max'] = plot.axes.xaxis.max;
            // }

        },
        jqplotResetZoom:(ev, gridpos, datapos, plot, cursor)=>{
            // var plotData = plot.series[0].data;
            // for(let i=0;i<this.params.length;i++){
            //     this.params.eventConfig.axes.xaxis['min'] = this.xMin;
            //     this.params.eventConfig.axes.xaxis['max'] = this.xMax;
            // }
            this.trendConfig['axes']['xaxis']['min'] = this.xMin;
            this.trendConfig['axes']['xaxis']['max'] = this.xMax;

            this.trendConfig = Object.assign({},this.trendConfig);

            this._chRef.detectChanges();
        }

        
    };
    constructor(private _chRef: ChangeDetectorRef) { }

    ngOnInit() {


    }
    public init(){

    }
    randomRange(maximum, minimum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
    }
    ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
        
        if(changes['xMin']!=null){
            this.trendConfig['axes']['xaxis']['min'] = this.xMin;
            this.trendConfig = Object.assign({},this.trendConfig);
        }

        if(changes['xMax']!=null){
            this.trendConfig['axes']['xaxis']['max'] = this.xMax;
            this.trendConfig = Object.assign({},this.trendConfig);
        }

    }
    ngDoCheck() {
        //    this.selectecItemAction();
        //        console.log(this.displayName+":"+this.selectedItems.length);
    }
    sortByKey(array, key,sortType) {
       
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            if(sortType=="asc"){
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            }else{
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }
            
        });
    }
    sortClick(type){

        if(type=='parameter'){
            if(this.sort.parameter!='none'){
                if(this.sort.parameter=="asc"){
                    this.sort.parameter="desc";
                    this.sortByKey(this.params,"name",'desc');
                }else{
                    this.sort.parameter="asc";
                    this.sortByKey(this.params,"name",'asc');
                }
            }else{
                this.sort.parameter="asc";
                this.sortByKey(this.params,"name",'asc');
            }

            this.sort.adHoc="none";

        }else{
            if(this.sort.adHoc!='none'){
                if(this.sort.adHoc=="asc"){
                    this.sort.adHoc="desc";
                    this.sortByKey(this.params,"adHoc",'desc');
                }else{
                    this.sort.adHoc="asc";
                    this.sortByKey(this.params,"adHoc",'asc');
                }
            }else{
                this.sort.adHoc="asc";
                this.sortByKey(this.params,"adHoc",'asc');
            }

            this.sort.parameter="none";
        }

    }
    setStatusEventConfig() {
        this.statusEventConfig = [];

        for (let i = 0; i < this.events.length; i++) {

            this.statusEventConfig.push({
                show: true,
                type: 'area',
                axis: 'xaxis',
                //background: true,
                fill: true,
                fillStyle: 'rgba(0, 255, 0, .5)',
                start: {
                    name: `event area`,
                    show: true, // default : false
                    // start: this.events[i][0],
                    value: this.events[i][0],
                    color: '#ff0000',
                    width: 1,       // default : 1
                    adjust: 0,      // default : 0
                    pattern: null,  // default : null
                    shadow: false,  // default : false
                    eventDistance: 3,   // default : 3
                    offset: {       // default : 0, 0
                        top: 0,
                        left: 0,
                    },
                    tooltip: {
                        show: true,
                        formatter: () => {
                            return `condition value`;
                        }
                    },
                    draggable: {
                        show: true
                    },
                    label: {
                        show: false,         // default : false
                        formatter: null,    // default : null (callback function)
                        classes: '',        // default : empty string (css class)
                        style: '',          // default : empty string (be able object or string)
                        position: 'n',      // default : n
                        offset: {           // default : 0, 0
                            top: 0,
                            left: 0
                        }
                    }
                },
                end: {
                    name: `event area`,
                    show: true, // default : false
                    // start: this.events[i][0],
                    value: this.events[i][1],
                    color: '#ff0000',
                    width: 1,       // default : 1
                    adjust: 0,      // default : 0
                    pattern: null,  // default : null
                    shadow: false,  // default : false
                    eventDistance: 3,   // default : 3
                    offset: {       // default : 0, 0
                        top: 0,
                        left: 0,
                    },
                    tooltip: {
                        show: true,
                        formatter: () => {
                            return `condition value`;
                        }
                    },
                    draggable: {
                        show: true
                    },
                    label: {
                        show: false,         // default : false
                        formatter: null,    // default : null (callback function)
                        classes: '',        // default : empty string (css class)
                        style: '',          // default : empty string (be able object or string)
                        position: 'n',      // default : n
                        offset: {           // default : 0, 0
                            top: 0,
                            left: 0
                        }
                    }
                }
            });
        }

        for(let i=0;i<this.params.length;i++){
            this.params[i]['eventLines'] = this.statusEventConfig;
        }

    }

    onChange(event, param) {

        this.drawConditionLine(param);
    }
    onClickParam(param) {

        this.setStatusEventConfig();
        this.drawConditionLine(param);
    }
    drawConditionLine(param) {
        let selectedParamObj = null;
        for (let i = 0; i < this.params.length; i++) {
            this.params[i]['eventLines'] = [];
            if (this.params[i].name == param.name) {
                selectedParamObj = this.params[i];
                this.params[i].isEventParam = true;
            } else {
                this.params[i].isEventParam = false;
            }
        }

        if (selectedParamObj.conditionValue == null) {
            selectedParamObj.conditionValue = 1;
        }

        let eventLines = [];
        eventLines.push({
            show: true,
            type: 'line',
            axis: 'yaxis',
            //background: true,
            fill: true,
            fillStyle: 'rgba(255, 0, 0, .5)',
            line: {
                name: `condition value`,
                show: true, // default : false
                value: selectedParamObj.conditionValue,
                color: '#ff0000',
                width: 1,       // default : 1
                adjust: 0,      // default : 0
                pattern: null,  // default : null
                shadow: false,  // default : false
                eventDistance: 3,   // default : 3
                offset: {       // default : 0, 0
                    top: 0,
                    left: 0,
                },
                tooltip: {
                    show: true,
                    formatter: () => {
                        return `condition value`;
                    }
                },
                draggable: {
                    show: true
                },
                label: {
                    show: false,         // default : false
                    formatter: null,    // default : null (callback function)
                    classes: '',        // default : empty string (css class)
                    style: '',          // default : empty string (be able object or string)
                    position: 'n',      // default : n
                    offset: {           // default : 0, 0
                        top: 0,
                        left: 0
                    }
                }
            }
        });
        eventLines = eventLines.concat(this.statusEventConfig);
        selectedParamObj.eventLines = eventLines;
    }
}
