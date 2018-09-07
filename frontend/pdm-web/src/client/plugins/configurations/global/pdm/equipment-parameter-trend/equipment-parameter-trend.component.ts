import { Component, OnInit, ViewChild ,ViewEncapsulation} from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';

import { FabAreaEqpParamTreeComponent } from '../../../../common/fab-area-eqp-param-tree/fab-area-eqp-param-tree.component';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';
import { EquipmentParameterTrendChartComponent } from './component/equipment-parameter-trend-chart/equipment-parameter-trend-chart.component';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'equipment-parameter-trend',
    templateUrl: './equipment-parameter-trend.html',
    styleUrls: ['./equipment-parameter-trend.css'],
    providers: [PdmConfigService, PdmModelService],
    encapsulation: ViewEncapsulation.None

})
export class EquipmentParameterTrendComponent implements OnInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;
    @ViewChild('tree') tree: FabAreaEqpParamTreeComponent;
    @ViewChild('modelChart') modelChart: EquipmentParameterTrendChartComponent;

    

    searchTimePeriod = {
        from: null,
        to: null
    }
    searchTimePeriod2 = {
        from: null,
        to: null
    }
    statusData;
    statusColor:Array<{name: string; color: string;}> = [
        {name:'RUN', color:'#00b050'},
        {name:'IDLE', color:'#a6a6a6'}
    ];
    timePeriod  = {
        fromDate: 0,
        toDate: 0
    };


    paramDatas = [];

    showProgress = false;
    percentage: any = 0;
    total = 0;
    current = 0;

    eventType = "event";
    eventLines = [];

    aggregations = [
        { f: 'Mean', checked: false },
        { f: 'STD DEV', checked: false },
        { f: 'Max', checked: false },
        { f: 'Q3', checked: false },
        { f: 'Median', checked: false},
        { f: 'Q1', checked: false },
        { f: 'Min', checked: false },
        { f: 'Count', checked: false },
        { f: 'Sum', checked: false },
    ];
    aggregationChecked = false;
    aggregationTime = 1;

    simulation_params = [];

    canDrawEvent = false;
    canDrawAdHoc = false;

    selectedParam = false;

    treeParamSelect = false;
    tree2ParamSelect = false;

    constructor(private pdmModelService: PdmModelService, private pdmConfigService: PdmConfigService) {
        this.searchTimePeriod.to = new Date().getTime();
        let fromDate = new Date();
        // fromDate.setDate(fromDate.getDate()-1);
        fromDate.setHours(fromDate.getHours() - 3);
        this.searchTimePeriod.from = fromDate.getTime();

    }

    ngOnInit() {

    }
    selectParam(event){
        this.selectedParam = true;
        this.eventLines=[];
    }

    // jqplot 데이터 포맷 전환
    setChartDataSet(data: number[][]): number[][][] {
        const totalLen: number = data.length;
        const rowLen: number = data[0].length;

        let tmp: number[][][] = [];
        tmp[0] = [];
        tmp[1] = [];
        tmp[2] = [];
        
        let i: number = 0;
        let row: number[] = [];

        while( i < totalLen ){
            row = data[i];      // [x, y, alarm, warning]

            tmp[0].push([ row[0], row[1] ]);    // y
            tmp[1].push([ row[0], row[2] ]);    // alarm
            tmp[2].push([ row[0], row[3] ]);    // warning
            i++;
        }

        console.log( tmp );

        return tmp;
    }

    drawChart() {
        this.drawChart_init();

        let fabId = this.tree.selectedFab.fabId;
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        let eqpId = "";
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
                eqpId = element.eqpId;
            }

        }

        // [180829-TK] 불필요 코드로 추정 
        // this.pdmModelService.getWorstEqpInfo(fabId,eqpId,this.searchTimePeriod.from, this.searchTimePeriod.to).then((result)=>{
        //     console.log(result);

        //     if(result.length==0) return;
        //     this.timePeriod.fromDate = result[0].datas[0].start_dtts;
        //     this.timePeriod.toDate = result[0].datas[result[0].datas.length-1].end_dtts;

        //     this.statusData = result[0].datas.map(d=>{return {type:d.status,start:d.start_dtts,end:d.end_dtts}});
        // }).catch((e)=>{
        //     console.log(e);
        // })

        this.paramDatas = [];
        this.total = parameters.length;
        this.percentage = 0;
        this.current = 0;

        for (let i = 0; i < parameters.length; i++) {
            this.showProgress = true;
            try {

                this.pdmModelService.getTrendMultipleSpecConfig(fabId,0,0,parameters[i].paramId,0,0).then((datas)=>{
                    let alarm_spec = datas.alarm;
                    let warning_spec = datas.warning;
                    this.pdmModelService.getTraceDataByParamId(fabId, parameters[i].paramId, this.searchTimePeriod.from, this.searchTimePeriod.to).then((datas) => {
                        console.log(datas);
                        if (datas.length > 0) {
                            let paramInfo = {
                                name: parameters[i].paramName,
                                paramId: parameters[i].paramId,
                                datas: 
                                    this.setChartDataSet(datas)
                                ,
                                from:this.searchTimePeriod.from,
                                to:this.searchTimePeriod.to,
                                // alarm_spec:alarm_spec,
                                // warning_spec:warning_spec
                            };
                            this.paramDatas.push(paramInfo);
                        }
    
                        this.current++;
                        this.percentage = this.current / this.total * 100;
                        this.percentage = this.percentage.toFixed(0);
                        if (this.percentage >= 100) {
                            this.showProgress = false;
                            if(this.paramDatas.length>0){
                                this.canDrawEvent = true;
                                this.paramDatas = this.paramDatas.concat();
                            }
                        }
    
                    }).catch((err) => {
                        this.current++;
                        this.percentage = this.current / this.total * 100;
                        this.percentage = this.percentage.toFixed(0);
                        if (this.percentage >= 100) {
                            this.showProgress = false;
                            if(this.paramDatas.length>0){
                                this.canDrawEvent = true;
                                this.paramDatas = this.paramDatas.concat();
                            }
                        }
                        console.error(err);
                    })
                }).catch((e)=>{
                    console.log(e);
                })

                
            } catch (e) {
                console.log(e)
            }

        }

    }
    // drawEvent() {

    //     this.drawEvent_init();

    //     this.componentSpinner.showSpinner();
    //     let fabId = this.tree.selectedFab.fabId;
    //     let paramId = this.modelChart.getParamId();
    //     let conditionValue = this.modelChart.getConditionValue();
    //     this.pdmModelService.getTraceDataEventSimulation(fabId, paramId, this.searchTimePeriod.from, this.searchTimePeriod.to, conditionValue).then((datas) => {
    //         this.eventLines = datas;
    //         this.canDrawAdHoc = true;
    //         this.componentSpinner.hideSpinner();

    //     })
    //         .catch((e) => {
    //             console.log(e);
    //             this.componentSpinner.hideSpinner();
    //         })
    // }
    drawChart_init(){
        this.canDrawAdHoc = false;
        this.selectedParam = false;
        this.eventLines = [];

        this.modelChart.init();

    }
    drawEvent_init(){
        this.modelChart.initEvent();
    }
   
    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }
   
    
  
    nodeClick(event){
        let node = this.tree.getSelectedNodes();
        let parameters = [];
        for (let index = 0; index < node.length; index++) {
            const element = node[index];
            if (element.nodeType == 'parameter') {
                parameters.push(element);
            }

        }
        if(parameters.length>0){
            this.treeParamSelect = true;
        }else{
            this.treeParamSelect = false;
        }
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

}