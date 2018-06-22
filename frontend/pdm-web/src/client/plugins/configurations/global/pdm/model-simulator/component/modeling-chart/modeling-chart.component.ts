
import { Component, ViewChild, ElementRef, OnInit, EventEmitter, Output, Input, OnChanges, DoCheck } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BistelChartComponent } from '../../../../../../../sdk/charts/charts/bistel-chart.component';

@Component({
    moduleId: module.id,
    selector: 'modeling-chart',
    templateUrl: `modeling-chart.html`,
    styleUrls: [`modeling-chart.css`]
})
export class ModelingChartComponent implements OnInit, OnChanges, DoCheck {

    @Input() params;
    @Input() eventLines;
    @Output() selectParam = new EventEmitter<any>();
    selectedParamId;
    conditionValue;
    conditionParamId;
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
            // tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
            //     tooltipContentProc(this.trendConfig['series'][seriesIndex].label + ': ' + moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
            // },
        }
    };

    eventConfig = {
        jqplotDblClick: (ev: any, seriesIndex: number, pointIndex: number, data: any) => {
            console.log(ev);
        }
    };
    sort={parameter:'none',adHoc:'none'};
    constructor() { }

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
    ngOnChanges() {
        if(this.params!=null && this.params.length>0){
            this.trendConfig['axes']['xaxis']['min'] = this.params[0].from;
            this.trendConfig['axes']['xaxis']['max'] = this.params[0].max;

        }

        this.setStatusEventConfig();
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
    public init(){
        this.selectedParamId=null;
        this.conditionValue=null;
        this.conditionParamId=null;
    }
    public initEvent(){

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
        for(let i=0;i<this.params.length;i++){
            this.params[i]['eventLines'] = this.statusEventConfig;
            if(this.selectedParamId!=null && this.selectedParamId==this.params[i].paramId){
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

        this.conditionValue = param.datas[0].map(a=>a[1]).reduce((a,b)=>{
            return a+b;
        })/param.datas[0].length;

        this.conditionParamId = param.paramId;

        this.setStatusEventConfig();
        this.drawConditionLine(param);
       
    }
    drawConditionLine(param) {
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
                    dragStop:(ev, newValue, neighbor, plot)=>{
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
        if(selectedParamObj!=null){
            selectedParamObj.eventLines = eventLines;
        }
        
    }
    public getParamId(){
        return this.selectedParamId;
    }
    public getConditionValue(){
        return this.conditionValue;
    }
    public getConditionParamId(){
        return this.conditionParamId;
    }
}
