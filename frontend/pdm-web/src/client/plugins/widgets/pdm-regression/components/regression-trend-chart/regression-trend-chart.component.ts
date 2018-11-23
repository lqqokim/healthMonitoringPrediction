import { Component, OnInit, OnChanges, ViewEncapsulation, Input, SimpleChanges, AfterViewInit } from '@angular/core';
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

    divId:any = '';
    plots:any = [];
    createChart:boolean = false;

    paramTrendDatas:any = [];

    config:any = {
        displayModeBar: false
       ,responsive: true
    };

    layout:any = {
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
            zeroline: true
        }, 
        yaxis: {
            anchor: 'free', 
            autorange: true, 
            fixedrange: true, 
            type: 'linear'
        }
    };
  

    constructor() {

    }

    ngOnInit() {
        let myDiv:any = document.getElementById(this.divId);    
        console.warn(this.data);
        this.divId = this.chartId;
        this.plots = this.chartIds;
        console.warn(this.plots);
        this.createTrendData(this.data);   
    }
    
    ngAfterViewInit(){
    
    }

    ngOnChanges(changes: SimpleChanges) { 
        console.log('asdasd');
        console.log(changes);
        console.warn(this.createChart);
        if(this.createChart == true){
            let myDiv:any = document.getElementById(this.divId);        
            if(changes['dragMode']['currentValue'] == 'zoom'){
                myDiv.layout.dragmode = 'zoom';
                Plotly.redraw(this.divId);   
            }else{
                myDiv.layout.dragmode = 'select';
                Plotly.redraw(this.divId);
            }
            this.plots = this.chartIds;
        }
    }
    
    createTrendData(Datas){
        let datas:any={};
        let chartDatas:any = Datas;
        let xData=[];
        let yData=[];        
        
        for(let i in chartDatas){
            xData.push(chartDatas[i][0]);
            yData.push(chartDatas[i][1]);           
        }           
        datas = {
            x: xData, 
            y: yData, 
            line: {width: 1}, 
            marker: {
                line: {width: 1}, 
                size: 4, 
                sizemode: 'area', 
                sizeref: 0.00395061728395
            }, 
            mode: 'markers+lines', 
            type: 'scattergl',
        };
        this.paramTrendDatas.push(datas); 
        setTimeout(()=>{        
            this.drawParamTrend(this.paramTrendDatas);
        }, 500);
    }
    
    drawParamTrend(data): void {
        // let myDiv:any = document.getElementById(this.divId);        
        Plotly.plot(this.divId, {
            data: data,
            layout: this.layout,
            config: this.config,            
        });
        this.createChart = true;
        this.plotlyRelayoutOn();
        this.plotlySelectedOn();        
    }     
    
    plotlySelectedOn(){        
        let myPlot:any = document.getElementById(this.divId);
        myPlot.on('plotly_selected', (eventData)=> {   
            console.warn(eventData);  
            if(eventData == undefined){
                this.brushOuts();
            }else{        
                this.brushIns(eventData);
                // this.drawLines(eventData);
            }      
        });        
    }
    
    plotlyRelayoutOn(){        
        console.warn('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
        let myPlot:any = document.getElementById(this.divId);
        myPlot.on('plotly_relayout',
        (eventdata)=>{  
            console.warn(eventdata);  
            if(eventdata["xaxis.range[0]"] == undefined){
                this.zoomOuts();
            }else{
                var update = {'xaxis.range': [eventdata['xaxis.range[0]'], eventdata['xaxis.range[1]']]};
                this.zoomIns(update);
            }      
        });
        
    }
    
    // drawLines(){ //각자 그린다 Regression
    //     let lineDatas = 
    //       {
        //         type: 'line',
        //         x0: 1542092023000,
        //         y0: 2,
        //         x1: 1542437623000,
        //         y1: 2,
        //         line: {
            //             color: 'rgb(128, 0, 128)',
            //             width: 3       
            //         }
            //       };
            //     myDiv.layout["shapes"].push(lineDatas);   
            //     console.warn(myDiv.layout["shapes"]); 
            //      Plotly.redraw(myDiv);
            //   }
            
            
            zoomIns(update){
                console.warn('zoomIns');                       
                for(let plotElement of this.plots){   
                    if(plotElement != this.divId){
                        Plotly.relayout(plotElement, update);
                    }
                }
            }
            
            zoomOuts(){
                for(let plotElement of this.plots){
                    Plotly.redraw(plotElement);
                }
            }
            
            brushIns(eventData){  
                console.warn('brushIns');
                for(let plotElement of this.plots){                     
                    let myDiv:any = document.getElementById(plotElement);        
                    myDiv.layout["shapes"]=[]
                    myDiv.layout["shapes"]= [    
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
               
                    Plotly.redraw(plotElement);
                }
            }
            
            brushOuts(){
                console.warn('brushOuts');
                console.warn(this.plots);
                for(let plotElement of this.plots){  
                    let myDiv:any = document.getElementById(plotElement);       
                    myDiv.layout["shapes"]=[];                  
                    Plotly.redraw(plotElement);                  
                }  
            }
            
            ngOnDestroy() {
                
            }
        }