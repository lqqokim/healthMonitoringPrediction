
import {ViewEncapsulation, Component, ViewChild, ElementRef, OnInit, EventEmitter, Output, Input, OnChanges, SimpleChange, DoCheck ,ChangeDetectorRef} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BistelChartComponent } from '../../../../../../../sdk/charts/charts/bistel-chart.component';

@Component({
    moduleId: module.id,
    selector: 'modeling-chart',
    templateUrl: `modeling-chart.html`,
    styleUrls: [`modeling-chart.css`],
    encapsulation: ViewEncapsulation.None
    
})
export class ModelingChartComponent implements OnInit, OnChanges, DoCheck {

    @Input() params;
    @Input() eventLines;
    @Input() xMin;
    @Input() xMax;
    @Input() eqpEvents;
    @Output() selectParam = new EventEmitter<any>();
    @ViewChild("bistelchart") bistelchart:BistelChartComponent[];
    selectedParamId;
    conditionValue;
    conditionParamId;
    conditionStartOperator=">";
    conditionEndOperator=">=";
    endOperators=[];
    timeoutValue: number;

    operators =[
        {name:'>',value:'>',subOperators:[{name:'>=',value:'>='}]},
        {name:'<',value:'<',subOperators:[{name:'<=',value:'<='}]},
        {name:'>=',value:'>=',subOperators:[{name:'>',value:'>'}]},
        {name:'<=',value:'<=',subOperators:[{name:'<',value:'<'}]},

    ]

    paramChartData;

    // bistelchart = [];
    // params = [
    //     { name: 'param1', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param2', isEventParam: false, conditionValue: null, datas: [],eventConfig:[] },
    //     { name: 'param3', isEventParam: false, conditionValue: null, datas: [] ,eventConfig:[]}
    // ]
    // events = [

    // ];
    statusEventConfig = [];
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
                    },
                    
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
                },
                
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
            // tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
            //     tooltipContentProc( moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
            // },
            tooltipContentEditor: function (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any) {  
                let date: string = plot.data[seriesIndex][pointIndex][0]; 
                let score: any = plot.data[seriesIndex][pointIndex][1]; 
                date = moment(date).format('YYYY/MM/DD HH:mm:ss')
                score = score.toFixed(2)   
                tooltipContentProc(
                `<div class='bisTooltip'>`+               
                    `<dl>`+
                        `<dt>date</dt>`+
                        `<dd>${date}</dd>`+
                    `</dl>`+
                    `<dl>`+
                        `<dt>score</dt>`+
                        `<dd>${score}</dd>`+
                    `</dl>`+
                `</div>`
                )
            },
        }
    };

    eventConfig = {
        jqplotDblClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
            console.log(ev);
        },
        jqplotZoom: (ev, gridpos, datapos, plot, cursor)=>{
            var plotData = plot.series[0].data;

            this.trendConfig.axes.xaxis['min'] = plot.axes.xaxis.min;
            this.trendConfig.axes.xaxis['max'] = plot.axes.xaxis.max;
            this.trendConfig = Object.assign({},this.trendConfig);
            this._chRef.detectChanges();

        },
        jqplotUndoZoom:(ev, gridpos, datapos, plot, cursor)=>{
            var plotData = plot.series[0].data;

        },
        jqplotResetZoom:(ev, gridpos, datapos, plot, cursor)=>{
            // var plotData = plot.series[0].data;

            this.trendConfig.axes.xaxis['min'] = this.xMin;
            this.trendConfig.axes.xaxis['max'] = this.xMax;
            this.trendConfig = Object.assign({},this.trendConfig);
            this._chRef.detectChanges();
        }

        
    };
    sort = { parameter: 'none', adHoc: 'none' };


    chartOptions = {

        padding: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 100,
        },
        color: {
            pattern: ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
        },
        transition: {
            duration: 100
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d',
                    count: 10
                }
            }
        },
        point: {
            show: false
        },
        zoom: {
            enabled: false
        },
        legend: {
            show: false
        },
        tooltip: {
            show: false
        }
    }



    constructor(private _chRef: ChangeDetectorRef) { }

    ngOnInit() {

        // let startDateTime = new Date().getTime() - 100 * 1000;
        // for (let i = 0; i < this.params.length; i++) {
        //     let datas = [];
        //     for (let j = 0; j < 100; j++) {
        //         datas.push([new Date(startDateTime + j * 1000), this.randomRange(1, 100)]);
        //     }
        //     this.params[i].datas.push(datas);
        // }

        // this.events.push([this.params[0].datas[0][10][0], this.params[0].datas[0][15][0]]);

        // this.events.push([this.params[0].datas[0][20][0], this.params[0].datas[0][40][0]]);

        // this.events.push([this.params[0].datas[0][70][0], this.params[0].datas[0][80][0]]);

    }
    randomRange(maximum, minimum) {
        return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
    }
    ngOnChanges(changes: { [propertyName: string]: SimpleChange }): void {
        // if (this.xMin!=null && this.xMax!=null) {
        //     this.trendConfig['axes']['xaxis']['min'] = this.xMin;
        //     this.trendConfig['axes']['xaxis']['max'] = this.xMax;
        // }
        if(changes['xMin']!=null ){
            this.trendConfig['axes']['xaxis']['min'] = this.xMin;
            this.trendConfig = Object.assign({},this.trendConfig);
        }
        if(changes['xMax']!=null ){
            this.trendConfig['axes']['xaxis']['max'] = this.xMax;
            this.trendConfig = Object.assign({},this.trendConfig);
        }

        this.setStatusEventConfig();

        if(changes["eqpEvents"]!=null &&  this.eqpEvents.length>=2){
            console.log('modeling changes', this.eqpEvents)
            let eqpId ="";
            for (let index = 0; index < this.eqpEvents.length; index++) {
                const element = this.eqpEvents[index];
                eqpId = element.eqpId;
                if(element.eventTypeCd="S"){
                    let operator = element.condition.replace('value','').trim();
                    let value="";
                    if(operator.substring(0,2)==">="){
                        value = operator.substring(2);
                        operator = ">=";
                    }else if(operator.substring(0,2)=="<="){
                        value = operator.substring(2);
                        operator = "<=";
                    }else if(operator.substring(0,1)=="<"){
                        value = operator.substring(1);
                        operator = "<";
                    }else if(operator.substring(0,1)==">"){
                        value = operator.substring(1);
                        operator = ">";
                    }
                    this.conditionStartOperator = operator;
                    this.conditionValue = parseFloat(value);
                    this.timeoutValue = this.eqpEvents[index].timeout;
                }
                // }else if(element.eventTypeCd="E"){ //End는 보이는 모양이 반대라서 Operation모두 반대임 
                //     let operator = element.condition.replace('value','').trim();
                //     let value="";
                //     if(operator.substring(0,2)==">="){
                //         value = operator.substring(2);
                //         operator = "<=";
                //     }else if(operator.substring(0,2)=="<="){
                //         value = operator.substring(2);
                //         operator = ">=";
                //     }else if(operator.substring(0,1)=="<"){
                //         value = operator.substring(1);
                //         operator = ">";
                //     }else if(operator.substring(0,1)==">"){
                //         value = operator.substring(1);
                //         operator = "<";
                //     }
                //     this.conditionEndOperator = operator;
                //     this.conditionValue = parseFloat(value);
                // }
                
            }
            this.onChangeOperator();

            this.selectedParamId =  this.eqpEvents[0].paramId.toString();
            this.conditionParamId = this.eqpEvents[0].paramId.toString();
            // this.setStatusEventConfig();
            let param = null;
            for(let i=0;i<this.params.length;i++){
                if(this.params[i].paramId == this.selectedParamId){
                    param = this.params[i];
                    break;
                }
            }
            // this.selectParam.emit(param);

            this.drawConditionLine(param);

            //향후 수정 Hard coding
            setTimeout(()=>{$('.chart-container').animate({ scrollTop: $('.scroll-here').offset().top -90 }, 500)});
        }
    }
    // getChartData(datas){
    //     let chartOptions = $.extend(true,{},this.chartOptions);
    //     if(datas[0][0][0]!='time'){
    //         datas[0].unshift(['time','value']);
    //     } 


    //     chartOptions.axis.x['min'] = this.params[0].from;
    //     chartOptions.axis.x['max'] = this.params[0].max;

    //     chartOptions.data.rows= datas[0];
    //     return chartOptions;
    // }
    ngDoCheck() {
        //    this.selectecItemAction();
        //        console.log(this.displayName+":"+this.selectedItems.length);

    }
    sortByKey(array, key, sortType) {

        return array.sort(function (a, b) {
            var x = a[key]; var y = b[key];
            if (sortType == "asc") {
                return ((x < y) ? -1 : ((x > y) ? 1 : 0));
            } else {
                return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            }

        });
    }
    sortClick(type) {

        if (type == 'parameter') {
            if (this.sort.parameter != 'none') {
                if (this.sort.parameter == "asc") {
                    this.sort.parameter = "desc";
                    this.sortByKey(this.params, "name", 'desc');
                } else {
                    this.sort.parameter = "asc";
                    this.sortByKey(this.params, "name", 'asc');
                }
            } else {
                this.sort.parameter = "asc";
                this.sortByKey(this.params, "name", 'asc');
            }

            this.sort.adHoc = "none";

        } else {
            if (this.sort.adHoc != 'none') {
                if (this.sort.adHoc == "asc") {
                    this.sort.adHoc = "desc";
                    this.sortByKey(this.params, "adHoc", 'desc');
                } else {
                    this.sort.adHoc = "asc";
                    this.sortByKey(this.params, "adHoc", 'asc');
                }
            } else {
                this.sort.adHoc = "asc";
                this.sortByKey(this.params, "adHoc", 'asc');
            }

            this.sort.parameter = "none";
        }

    }
    public init() {
        this.selectedParamId = null;
        this.conditionValue = null;
        this.conditionParamId = null;
    }
    public initEvent() {

    }
    setStatusEventConfig() {
        this.statusEventConfig = [];

        for (let i = 0; i < this.eventLines.length; i++) {

            this.statusEventConfig.push({
                show: true,
                type: 'area',
                axis: 'xaxis',
                //background: true,
                fill: true,
                fillStyle: 'rgba(0, 255, 0, .1)',
                start: {
                    name: `event area`,
                    show: true, // default : false
                    // start: this.events[i][0],
                    value: this.eventLines[i][0],
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
                        show: false
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
                    value: this.eventLines[i][1],
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
                        show: false
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

        let param = null;
        for (let i = 0; i < this.params.length; i++) {
            this.params[i]['eventLines'] = this.statusEventConfig;
            if (this.selectedParamId != null && this.selectedParamId == this.params[i].paramId) {
                param = this.params[i];
            }
        }
        
        this.drawConditionLine(param);
    }

    onChange(event, param) {

        this.drawConditionLine(param);
    }
    onClickParam(param) {
        this.selectParam.emit(param);

        this.conditionValue = param.datas[0].map(a => a[1]).reduce((a, b) => {
            return a + b;
        }) / param.datas[0].length;

        this.conditionParamId = param.paramId;

        // this.selectedParamId = param.paramId;
        this.onChangeOperator();
        this.setStatusEventConfig();
        this.drawConditionLine(param);

    }
    onChangeOperator(){
        for(let i=0;i<this.operators.length;i++){
            let key = this.operators[i].name;
            if(key==this.conditionStartOperator){
                this.endOperators = this.operators[i].subOperators;
                if(this.endOperators.length==1){
                    this.conditionEndOperator = this.endOperators[0].name;
                }
                break;
            }
        }
    }
    onChangeTimeout(ev, param): void {
        console.log('onChangeTimeout', ev, param);
        this.timeoutValue = ev.target.value;
    }
    drawConditionLine(param) {
        if(param==null) return;

        let selectedParamObj = null;
        for (let i = 0; i < this.params.length; i++) {
            // this.params[i]['eventLines'] = [];
            if (this.params[i].name == param.name) {
                selectedParamObj = this.params[i];
                this.params[i].isEventParam = true;
            } else {
                this.params[i].isEventParam = false;
            }
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
                value: this.conditionValue,
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
                    show: true,
                    dragStop: (ev, newValue, neighbor, plot) => {
                        this.conditionValue = newValue;
                    }
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
        if (selectedParamObj != null) {
            selectedParamObj.eventLines = eventLines;
        }

    }
    public getParamId() {
        return this.selectedParamId;
    }
    private getFloat(data){
        if(data.toString().indexOf('.')>=0){
            return data.toString();
        }else{
            return data.toFixed(2);
        }
    }
    public getConditionValue() {
        // return  parseFloat( this.conditionValue);
        return this.getFloat(this.conditionValue);
    }
    public getConditionParamId() {
        return this.conditionParamId;
    }
    public getConditionStartOperator(){
        return this.conditionStartOperator;
    }
    public getConditionEndOperator(){


        if(this.conditionEndOperator==">="){
            return "<=";
        }else if(this.conditionEndOperator=="<="){
            return ">=";
        }else if(this.conditionEndOperator=="<"){
            return  ">";
        }else if(this.conditionEndOperator==">"){
            return  "<";
        }

        return this.conditionEndOperator;
    }
    public getTimeoutValue() {
        return this.timeoutValue;
    }
}
