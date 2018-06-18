import { Component, OnInit, ViewChild } from '@angular/core';

import { PdmConfigService } from '../model/pdm-config.service';
import { PdmModelService } from './../../../../../common/model/app/pdm/pdm-model.service';

//Wijmo
import { FlexGrid, CellRangeEventArgs } from 'wijmo/wijmo.grid';
import * as wjcGrid from 'wijmo/wijmo.grid';
import { ModalAction, ModalRequester, RequestType } from '../../../../../common';
import { NotifyService, Translater, SpinnerComponent } from '../../../../../sdk';

// import { CODE_LIST } from './mock-data';

@Component({
    moduleId: module.id,
    selector: 'filter-analysis',
    templateUrl: './filter-analysis.html',
    styleUrls: ['./filter-analysis.css'],
    providers: [PdmConfigService, PdmModelService],
})
export class FilterAnalysisComponent implements OnInit {
    @ViewChild('componentSpinner') componentSpinner: SpinnerComponent;

    private areas: Array<any> = [];
    private eqps: Array<any> = [{'name':'eqp1'},{'name':'eqp2'},{'name':'eqp3'}];
    private parameters: Array<any> = [{'name':'param1'},{'name':'param2'},{'name':'param3'}];
    // private functions = ['-none-','sum','avg','max','min','count'];
    // private functions = ['sum','avg','max','min','count'];
    private functions = [
        {display:'sum',value:'sum'},
        {display:'avg',value:'avg'},
        {display:'max',value:'max'},
        {display:'min',value:'min'},
        {display:'count',value:'count'}
        ];
    private groups = [
        {display:'seconds',value:'seconds'},
        {display:'minutes',value:'minutes'},
        {display:'hours',value:'hours'},
        {display:'days',value:'days'},
    ];
    conditionShow = true;
    dataShow = true;
    
    // filterFieldNames = ['-none-','LOCATION','VALUE'];
    filterFieldNames = [{display:'-none-',value:'-none-'}];
    filterCriteria={
        Operator:['','AND','OR'],
        FieldName:this.filterFieldNames,
        Condition:[
            // {display:'=',value:'='},
            // {display:'<',value:'<'},
            // {display:'>',value:'>'},
            // {display:'<=',value:'<='},
            // {display:'>=',value:'>='},
            // {display:'like',value:'like'}
            {display:'=',value:'equal'},
            {display:'<',value:'lessthan'},
            {display:'>',value:'greaterthan'},
            {display:'<=',value:'lessthanequal'},
            {display:'>=',value:'greaterthanequal'},
            // {display:'<>',value:'notequal'},
            {display:'like',value:'like'}
        ]
    }

    filterCriteriaDatas = [
        {operator:'AND',fieldName:'-none-',functionName:'count' ,condition:'equal',value:''},
    ]

    aggregationDatas={functions:['count'],groupValue:'1',groupUnit:'minutes',use:true};
    useAggregation = true;

    searchTimePeriod={
        from:null,
        to:null
    }

    plants: any=[{fabId:'',fabName:''}];
    selectedFab={fabId:'',fabName:''};
    selectedArea;
    selectedEqpIds;
    selectedParameters;

    selectedAreaDatas;
    selectedEqpDatas;
    selectedParameterDatas;
    selectedFunctionDatas = [{display:'count',value:'count'}];

    // eqpNParamIds = [];
    eqpIdsParamIds =[];
    datas = [];

    percentage:any=0;
    totalCount = 0;
    currentCount =0;
    showProgress = false;
    cancelRequest = false;

    overalyType = false;

    trendData = [[[1,1],[2,2],[3,0.5],[4,3],[5,1.5]]];

    trendConfig:any = {
        legend: {
            show: true,
        },

        seriesDefaults: {
            showMarker: false
        },
        axes: {
            xaxis: {
                min: this.searchTimePeriod[CD.FROM],
                max: this.searchTimePeriod[CD.TO],
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
            tooltipContentEditor: (str: string, seriesIndex: number, pointIndex: number, plot: any, tooltipContentProc: any, ev: Event) => {
                tooltipContentProc(this.trendConfig['series'][seriesIndex].label + ': '+ moment(parseInt(str.split(',')[0])).format('YYYY/MM/DD HH:mm:ss') + ' [' + (+str.split(',')[1]).toFixed(2) + ']');
            },
        }
    };









    constructor(private pdmModelService: PdmModelService,private pdmConfigService: PdmConfigService) {
        this.searchTimePeriod.to = new Date().getTime();
        let fromDate = new Date();
        fromDate.setDate(fromDate.getDate()-1);
        this.searchTimePeriod.from = fromDate.getTime();
    }

    ngOnInit() {
        $('#condition').collapse('show');
        this.conditionShow = true;
        this._getPlants();
    }


    clickRemoveFilter(i){
        this.filterCriteriaDatas.splice(i,1);
    }
    clickAddFilter(){
        this.filterCriteriaDatas.push({operator:'AND',fieldName:'-none-',functionName:'count' ,condition:'equal',value:''});
    }
    _getExtendFields(){
        this.pdmConfigService.getCodesByCategory(this.selectedFab.fabId,"reserved_column")
            .then((datas: any) => {
                for(let i=0;i<datas.length;i++){
                    if(datas[i].name.indexOf('reserved_col')<0){
                        this.filterFieldNames.push({display:datas[i].name,value:datas[i].code});
                    }
                    
                }
            }).catch((error: any) => {

            });
        
    }
    _getPlants(): void {
        this.pdmModelService.getPlants()
            .then((plants: any) => {
                this.plants = plants;
                this.selectedFab = this.plants[0];
                this._getAreas();
                this._getExtendFields();

            }).catch((error: any) => {

            });
    }
    _getAreas(){
        this.pdmModelService.getAllArea(this.selectedFab.fabId)
            .then((areas)=>{
                this.areas = areas;
                let areaDatas = localStorage.getItem("filter-analysis-areaDatas");
                if(areaDatas!=null){
                    this.selectedAreaDatas =JSON.parse( areaDatas);
                }
                        
            }).catch((error: any) => {

            });

    }
    _getEqps(){
        this.pdmModelService.getEqpsByAreaIds(this.selectedFab.fabId,this.selectedArea)
            .then((eqps)=>{
                this.eqps = eqps;
                let eqpDatas = localStorage.getItem("filter-analysis-eqpDatas");
                if(eqpDatas!=null){
                    this.selectedEqpDatas = JSON.parse(eqpDatas);
                }
        
            }).catch((error: any) => {

            });

        
    }
    _getParameters(){
        this.pdmModelService.getParamNameByEqpIds(this.selectedFab.fabId,this.selectedEqpIds)
            .then((params)=>{
                this.filterCriteria.FieldName = this.filterFieldNames;
                this.parameters = [];
                for (let index = 0; index < params.length; index++) {
                    const element = params[index];
                    this.parameters.push({'paramName':element});
                    this.filterCriteria.FieldName.push({display:element,value:element});
                }

                let eqpIds = localStorage.getItem("filter-analysis-eqps");
                if(eqpIds!=null){
                    if(this.selectedEqpIds == eqpIds){
                        let paramDatas = localStorage.getItem("filter-analysis-paramDatas");
                        this.selectedParameterDatas = JSON.parse(paramDatas);
                    }
                }
                
        

            }).catch((error: any) => {

            });

        
    }


    changeSelectedFab(event){
        this._getAreas();
    }

    onChangeArea(event){
        console.log(event);
        this.selectedArea= [];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.selectedArea.push(element.areaId);
        }
        this.selectedAreaDatas = event;
        if(this.selectedArea.length>0){
            this._getEqps();
        }else{
            this.eqps=[];
        }
        
    }
    onChangeEqp(event){
        console.log(event);
        this.selectedEqpIds =[];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.selectedEqpIds.push(element.eqpId);
        }
        this.selectedEqpDatas = event;
        if(this.selectedEqpIds.length>0){
            this._getParameters();
        }else{
            this.parameters =[];
        }
        
        
    }
    onChangeParameter(event){
        console.log(event);
        this.selectedParameters =[];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.selectedParameters.push(element.paramName);
        }
        this.selectedParameterDatas = event;
    }

    onClickToggleCondition(){
        let target = $('#condition');
        let arrowIcon = target.siblings('.panel-heading').children('span');

        if(this.conditionShow){
            target.collapse('hide');
            arrowIcon.removeAttr('show').attr('hide', '');
        } else {
            target.collapse('show');
            arrowIcon.removeAttr('hide').attr('show', '');
        }

        this.conditionShow = ! this.conditionShow; 
    }
    onClickToggleDatas(){
        if(this.dataShow){
            $('#datas').collapse('hide');
        }else{
            $('#datas').collapse('show');
        }

        this.dataShow = ! this.dataShow; 
    }
    onChangeFunction(event){
        this.aggregationDatas.functions=[];
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.aggregationDatas.functions.push(element.value);
        }
    }
    fromToChange(data: any) {
        this.searchTimePeriod = data;
    }
    checkboxChange(event){

    }

    search(){
        localStorage.setItem("filter-analysis-areaDatas",JSON.stringify(this.selectedAreaDatas));
        localStorage.setItem("filter-analysis-eqpDatas",JSON.stringify(this.selectedEqpDatas));
        localStorage.setItem("filter-analysis-paramDatas",JSON.stringify(this.selectedParameterDatas));

        this.pdmModelService.getEqpIdParamIdsInFilterTraceData(this.selectedFab.fabId,this.selectedEqpIds,this.selectedParameters,
            this.searchTimePeriod.from,this.searchTimePeriod.to,this.filterCriteriaDatas)
        .then((datas)=>{
            this.getFilterDatas(datas);
        }).catch((error: any) => {

        });


    }
    cancelSend(){
        this.cancelRequest = true;
    }

    checkboxClick(){
        this.aggregationDatas.use = !this.aggregationDatas.use ;
        if(this.aggregationDatas.use){
            $('#aggregation').attr('disabled','');
        }else{
            $('#aggregation').attr('disabled','disabled');
        }
    }
    eqpNParamIds =[];
    getFilterDatas(datas){
        let tempEqpNParamIds ={};
        for (let index = 0; index < datas.length; index++) {
            const element = datas[index];
            if(tempEqpNParamIds[element.EQPID]){
                tempEqpNParamIds[element.EQPID].push({paramId:element.PARAMID,paramName:element.PARAMNAME,eqpName:element.EQPNAME});
            }else{

                tempEqpNParamIds[element.EQPID] =[{paramId:element.PARAMID,paramName:element.PARAMNAME,eqpName:element.EQPNAME}] ;
            }
            
        }
        this.eqpNParamIds =[]; //tempEqpNParamIds;
        const keys = Object.keys(tempEqpNParamIds);
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            const paramIdNames = tempEqpNParamIds[key];
            let paramIds =[];
            let paramNames =[];
            const eqpName = paramIdNames[0].eqpName;
            for(let i=0;i<paramIdNames.length;i++){
                paramIds.push(paramIdNames[i].paramId);
                paramNames.push(paramIdNames[i].paramName);
            }
            this.eqpNParamIds.push({eqpId:key,paramIds:paramIds,paramNames:paramNames,eqpName:eqpName});
        }
        this.totalCount = this.eqpNParamIds.length;
        this.currentCount =1;
        this.percentage = this.currentCount*100 / this.totalCount;
        this.percentage =this.percentage - (100- this.percentage) * 0.1;
        if(this.percentage==100){
            this.percentage = 99;
        }
        this.percentage =this.percentage.toFixed(0);

        this.showProgress = true;
        this.datas =[];
        this.cancelRequest=false;

        this.trendConfig['series']=[];
        if(this.overalyType){
            this.trendConfig.axes.xaxis=  {
                // min: this.searchTimePeriod[CD.FROM],
                // max: this.searchTimePeriod[CD.TO],
                autoscale: true,
                // tickOptions: {
                //     formatter: (pattern: any, val: number, plot: any) => {
                //         return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
                //     }
                // },
                // rendererOptions: {
                //     dataType: 'date'
                // }
            };
        }else{
            this.trendConfig.axes.xaxis=  {
                min: this.searchTimePeriod[CD.FROM],
                max: this.searchTimePeriod[CD.TO],
                autoscale: true,
                tickOptions: {
                    formatter: (pattern: any, val: number, plot: any) => {
                        return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
                    }
                },
                rendererOptions: {
                    dataType: 'date'
                }
            };
        }
        this.trendConfig = Object.assign({},this.trendConfig);

        this.trendData=[];


        this.getFilterDataByEqpIdParamIds();



        // this.eqpIdsParamIds = datas;

        // this.totalCount = this.eqpIdsParamIds.length;
        // this.currentCount =1;
        // this.percentage = this.currentCount*100 / this.totalCount;
        // this.percentage =this.percentage.toFixed(0);

        // this.showProgress = true;
        // this.datas =[];
        // this.cancelRequest=false;


        // this.getFilterDataByEqpIdParamId();
        
    }
    
    getFilterDataByEqpIdParamId(){
        if(this.currentCount<=this.totalCount && this.cancelRequest==false){
            this.pdmModelService.getFilterTraceDataByEqpIdParamId(this.selectedFab.fabId,this.eqpIdsParamIds[this.currentCount-1].EQPID,
                this.eqpIdsParamIds[this.currentCount-1].PARAMID,this.searchTimePeriod.from,this.searchTimePeriod.to,this.filterCriteriaDatas,this.aggregationDatas)
            .then((datas)=>{
                this.currentCount++;
                this.percentage = this.currentCount*100 / this.totalCount;
                this.percentage =this.percentage.toFixed(0);
                if(this.datas.length==0){
                    this.datas = datas;
                }else{
                    this.datas = this.datas.concat(datas);
                }
                if(this.datas.length>0){
                    this.trendConfig['series'].push({label:datas[0].eqpName+'_'+datas[0].paramName});
                    let paramData = [];
                    for (let index = 0; index < datas.length; index++) {
                        const element = datas[index];
                        if(this.overalyType==false){
                            paramData.push([element.event_dtts,element.value]);
                        }else{
                            paramData.push([index,element.value]);
                        }
                        
                    }
                    this.trendConfig = Object.assign({},this.trendConfig);
                    if(this.overalyType){
                        this.trendConfig.axes.xaxis=  {
                            min: this.searchTimePeriod[CD.FROM],
                            max: this.searchTimePeriod[CD.TO],
                            autoscale: true,
                            // tickOptions: {
                            //     formatter: (pattern: any, val: number, plot: any) => {
                            //         return val ? moment(val).format('YY-MM-DD HH:mm:ss') : '';
                            //     }
                            // },
                            // rendererOptions: {
                            //     dataType: 'date'
                            // }
                        };
                    }
                    
                    this.trendData.push(paramData);
                }
                
                this.trendData = this.trendData.concat([]);

                this.getFilterDataByEqpIdParamId();
            }).catch((error: any) => {
                this.currentCount++;
                this.percentage = this.currentCount*100 / this.totalCount;
                this.percentage =this.percentage.toFixed(0);
                this.getFilterDataByEqpIdParamId();
            });
        }else{
            this.showProgress = false;
            this.currentCount =1;
        }
    }
    getFilterDataByEqpIdParamIds(){
        if(this.currentCount<=this.totalCount && this.cancelRequest==false){
            const eqpId =this.eqpNParamIds[this.currentCount-1].eqpId;
            const eqpName =this.eqpNParamIds[this.currentCount-1].eqpName;
            const paramIds = this.eqpNParamIds[this.currentCount-1].paramIds;
            const paramNames = this.eqpNParamIds[this.currentCount-1].paramNames;
            this.pdmModelService.getFilterTraceDataByEqpIdParamIds(this.selectedFab.fabId,eqpId,eqpName,
                paramIds,paramNames ,this.searchTimePeriod.from,this.searchTimePeriod.to,this.filterCriteriaDatas,this.aggregationDatas)
            .then((datas)=>{
                this.currentCount++;
                this.percentage = this.currentCount*100 / this.totalCount;
                this.percentage =this.percentage.toFixed(0);
                for(let i=0;i<datas.length;i++){
                    if(this.overalyType){
                        this.changeTimeToIndex(datas[i].timesValue);
                    }
                    this.datas = this.datas.concat(datas[i].timesValue);    

                    this.trendConfig['series'].push({label:datas[i].eqpName+'_'+datas[i].paramName});
                    let paramData = [];
                    this.trendConfig = Object.assign({},this.trendConfig);
                    this.trendData.push(datas[i].timesValue);
                }
                this.trendData = this.trendData.concat([]);
                
                this.getFilterDataByEqpIdParamIds();
            }).catch((error: any) => {
                this.currentCount++;
                this.percentage = this.currentCount*100 / this.totalCount;
                this.percentage =this.percentage.toFixed(0);
                this.getFilterDataByEqpIdParamIds();
            });
        }else{
            this.showProgress = false;
        }
    }
    changeTimeToIndex(datas){
        for(let i=0;i<datas.length;i++){
            datas[i][0]=i;
        }
    }
 
}