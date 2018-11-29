import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter, SimpleChanges, AfterViewInit } from '@angular/core';
import { PdmModelService } from './../../../../../common';
declare let Plotly: any;

@Component({
    moduleId: module.id,
    selector: 'regression-trend-chart',
    templateUrl: './regression-trend-chart.component.html',
    styleUrls: ['./regression-trend-chart.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class RegressionTrendChartComponent implements OnChanges, OnInit, AfterViewInit {
    @Input() dragMode;
    @Input() data;
    @Input() chartIds;
    @Input() chartId;
    @Input() chartType;
    @Input() imageData;
    @Input() originType;
    @Output()
    zoomEvent: EventEmitter<any> = new EventEmitter<any>();

    divId: any = '';
    plots: any = [];
    createChart: boolean = false;

    intercept:any;
    slope:any;
    r2:any;

    zoomCount = 0;
    trendEvent = true;

    paramTrendDatas: any = [];

    config: any = {
        displayModeBar: false
        , responsive: true
    };

    layout: any = {
        autosize: true,
        dragmode: 'zoom',
        hovermode: 'x',
        selectdirection: 'h',
        showlegend: false,
        xaxis: {
            anchor: 'free',
            autorange: true,
            fixedrange: false,           
            rangeslider: {
                autorange: false,
                thickness: 0.41,
                visible: false
            },
            showgrid: false,
            showspikes: true,
            side: 'bottom',
            spikethickness: 3,
            tickmode: 'auto',
            type: 'date',
            zeroline: true,
            showline: true,
        },
        yaxis: {
            anchor: 'free',
            autorange: true,
            fixedrange: true,
            type: 'linear',
            showline: true
        }
    };




    constructor(private _pdmModel: PdmModelService) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.createChart == true) {
            let myDiv: any = document.getElementById(this.divId);
          
            if(changes['data']!=null && changes['data']['currentValue'] != null) {              
                if(this.originType == 'image'){
                    if(this.trendEvent){
                        this.trendEvent = false;
                        this.createTrendData(this.data,true);
                    }
                }
            }

            if (changes['imageData']!=null && changes['imageData']['currentValue'] != null) {
                this.drawParamTrend(null,true);
                setTimeout(() => {                    
                    this.zoomCount =0;
                    this.trendEvent = true;
                }, 500);
            } 

            if (changes['dragMode']!=null && changes['dragMode']['currentValue'] == 'zoom') {
                myDiv.layout.dragmode = 'zoom';
                Plotly.redraw(this.divId);
            }
            if(changes['dragMode']!=null && changes['dragMode']['currentValue'] == 'select') {
                myDiv.layout.dragmode = 'select';
                Plotly.redraw(this.divId);
            }
        }else{
            this.divId = this.chartId;
            this.plots = this.chartIds;
            this.zoomCount = this.chartIds.length;
            this.createTrendData(this.data,false);
        }        
    }

    ngOnDestroy() {

    }

    createTrendData(Datas,reDraw) {
        let datas: any = {};
        let chartDatas: any = Datas;
        let xData = [];
        let yData = [];
      

        if(this.chartType != 'image'){              
            for (let i in chartDatas) {
                xData.push(chartDatas[i][0]);
                yData.push(chartDatas[i][1]);
            }
            datas = {
                x: xData,
                y: yData,
                line: { width: 1 },
                marker: {
                    line: { width: 1 },
                    size: 4,
                    sizemode: 'area',
                    sizeref: 0.00395061728395
                },
                mode: 'markers+lines',
                type: 'scattergl',
            };
        }
        this.paramTrendDatas = [];
        this.paramTrendDatas.push(datas);
        setTimeout(() => {
            this.drawParamTrend(this.paramTrendDatas,reDraw);
        }, 500);
    }

    drawParamTrend(data,reDraw): void {
        if(this.chartType == 'image'){
           const xMinMax = [moment(this.imageData.xMin).format('YYYY-MM-DD HH:mm:ss'),moment(this.imageData.xMax).format('YYYY-MM-DD HH:mm:ss')];
           const imagex = xMinMax[0];
           const imagey = this.imageData.yMax;
           const imageSizex =this.imageData.xMax - this.imageData.xMin;
           const imageSizey = this.imageData.yMax - this.imageData.yMin;
           let imgData = [{
                x:xMinMax,
                y:[this.imageData.yMin,this.imageData.yMax],
                hoverinfo: 'x',
                hoveron: 'fills',
                mode: 'none',
                type: 'scattergl',
            }];  
            let imgLayout = {
                autosize: true,
                dragmode: 'zoom',
                // hovermode: 'x',
                hovermode: false,               
                images: [
                    {
                        x: imagex,
                        y: imagey,
                        sizex: imageSizex,
                        sizey: imageSizey,
                        sizing: 'stretch',
                        source: this.imageData.image,
                        visible: true,
                        xref: 'x',
                        yref: 'y'
                    }
                ],
                selectdirection: 'h',
                showlegend: false,
                xaxis: {
                    autorange: false,
                    // range:['2018-11-01','2018-11-12'] ,
                    range: xMinMax,
                    rangeselector: {visible: false}, 
                    showgrid: false, 
                    showline: true, 
                    showspikes: false, 
                    ticks: 'inside', 
                    // autotick:true,
                    showticklabels :true,
                    type: 'date',
                },
                yaxis: {
                    autorange: false, 
                    fixedrange: true,
                    // range:[0,100],
                    range:[this.imageData.yMin,this.imageData.yMax],
                    showgrid: false, 
                    showline: true, 
                    side: 'left', 
                    ticklen: 5, 
                    ticks: 'inside', 
                    tickwidth: 1, 
                    type: 'linear', 
                    zeroline: false
                }
            };
            if(reDraw){
                Plotly.newPlot(this.divId, imgData, imgLayout, this.config)
            }else{
                Plotly.plot(this.divId, {
                    data: imgData,
                    layout: imgLayout,
                    config: this.config,
                });
            }
        }else{
            if(reDraw){
                Plotly.newPlot(this.divId, data, this.layout, this.config)
            }else{
                Plotly.plot(this.divId, {
                    data: data,
                    layout: this.layout,
                    config: this.config,
                });
            }
        }   
        this.createChart = true;
        this.plotlyRelayoutOn();
        this.plotlySelectedOn();
    }

    plotlySelectedOn() {
        let myPlot: any = document.getElementById(this.divId);
        myPlot.on('plotly_selected', (eventData) => {
            if (eventData == undefined) {
                this.brushOuts();
            } else {
                this.brushIns(eventData);
            }
        });
    }

    plotlyRelayoutOn() {
        let myPlot: any = document.getElementById(this.divId);
        myPlot.on('plotly_relayout',
            (eventdata) => {
                if (eventdata["xaxis.autorange"] == true) {
                    if(this.originType == 'image'){
                        if(this.chartType =='trend'){
                            if(this.trendEvent){
                                this.zoomOuts();                                            
                            }
                        }else{
                            this.zoomOuts();                                                    
                        }
                    }
                    this.zoomOuts();                                            
                }
                if(this.chartType == 'image'){
                    if(this.zoomCount == this.plots.length){

                    }else{
                        if (eventdata["xaxis.range[0]"] != null || eventdata["xaxis.range[0]"] != undefined) {
                            var update = { 'xaxis.range': [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']] };
                            this.zoomIns(update);
                        }
                    }
                }else{
                    if (eventdata["xaxis.range[0]"] != null || eventdata["xaxis.range[0]"] != undefined) {
                        var update = { 'xaxis.range': [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']] };
                        this.zoomIns(update);
                    }
                }
            });

    }

    drawLines(myId,stDate,edDate){ //각자 그린다 Regression
        
        this._pdmModel.getRegression(myId,stDate,edDate)
            .subscribe(data =>{
                let myDiv: any = document.getElementById(myId);
                 let lineDatas = 
                {
                    type: 'line',
                    x0: data.start_xValue,
                    y0: data.start_yValue,
                    x1: data.end_xValue,
                    y1: data.end_yValue,
                    line: {
                        color: 'rgb(128, 0, 128)',
                        width: 3       
                    }
                };
                    myDiv.layout["shapes"].push(lineDatas);   
                    Plotly.redraw(myDiv);  
                    this.drawOtherSet(myId,data);                  
                })    
      }

      drawOtherSet(myId,data){
        let fomulaId:any = myId+'_formula';
        let r2Id:any = myId+'_R2';
        document.getElementById(fomulaId).innerHTML = data.intercept +'+'+ data.slope +'*TIME';
        document.getElementById(r2Id).innerHTML = data.r2;
      }


    zoomIns(update) {
        if(this.chartType == 'image'){ 
            this.zoomCount = this.plots.length 
            for (let plotElement of this.plots) {               
                const zoomInfo = {
                    type: 'Zoom',
                    fromdate: update['xaxis.range'][0],
                    todate: update['xaxis.range'][1],
                    sessionId: plotElement              
                };          
                this.zoomEvent.emit(zoomInfo);
            }
        }else{
            for (let plotElement of this.plots) {
                if (plotElement != this.divId) {
                    Plotly.relayout(plotElement, update);
                }
            }
        }
    }

    zoomOuts() {
        if(this.chartType == 'image'){  
            for (let plotElement of this.plots) {               
                const zoomInfo = {
                    type: 'Origin',
                    fromdate: null,
                    todate: null,
                    sessionId: plotElement              
                };          
                this.zoomEvent.emit(zoomInfo);
            }
        }else{
            if(this.originType == 'image'){
                for (let plotElement of this.plots) {               
                    const zoomInfo = {
                        type: 'Origin',
                        fromdate: null,
                        todate: null,
                        sessionId: plotElement              
                    };          
                    this.zoomEvent.emit(zoomInfo);
                }
            }else{                
                for (let plotElement of this.plots) {
                    let myDiv: any = document.getElementById(plotElement);
                    myDiv.layout["xaxis"] = {}
                    myDiv.layout["xaxis"] =
                    {   anchor: 'free',
                        autorange: true,
                        fixedrange: false,
                        rangeslider: {
                            autorange: false,
                            thickness: 0.41,
                            visible: false
                        },
                        showgrid: false,
                        showspikes: true,
                        side: 'bottom',
                        spikethickness: 3,
                        tickmode: 'auto',
                        type: 'date',
                        zeroline: true
                    };
                    myDiv.layout["yaxis"] = {}
                    myDiv.layout["yaxis"] =
                    {
                        anchor: 'free',
                        autorange: true,
                        fixedrange: true,
                        type: 'linear'
                    };
                    Plotly.redraw(plotElement);
                }
            }
        }
    }

    brushIns(eventData) {
        for (let plotElement of this.plots) {
            let myDiv: any = document.getElementById(plotElement);
            let xDate:any ='';
            let yDate:any ='';           
            myDiv.layout["shapes"] = []
            myDiv.layout["shapes"] = [
                {
                    'type': 'rect',
                    'xref': 'x',
                    'yref': 'paper',
                    'x0': eventData.range.x[0],
                    'y0': 0,
                    'x1': eventData.range.x[1],
                    'y1': 1,
                    'fillcolor': '#d3d3d3',
                    'opacity': 0.2,
                    'line': {
                        'width': 0,
                    }
                }
            ]

            xDate = new Date(eventData.range.x[0]).getTime();
            yDate = new Date(eventData.range.x[1]).getTime();

            Plotly.redraw(plotElement);
            this.drawLines(plotElement,xDate,yDate);          
        }
    }

    brushOuts() {
        for (let plotElement of this.plots) {
            let myDiv: any = document.getElementById(plotElement);
            myDiv.layout["shapes"] = [];
            Plotly.redraw(plotElement);
        }
    }

    getImageSize(){
        return {width:$('#'+this.divId).find('.nsewdrag').width(),height:$('#'+this.divId).find('.nsewdrag').height()};
    }
   
}