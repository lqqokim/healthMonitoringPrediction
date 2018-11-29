import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild, Input, SimpleChanges, AfterViewInit } from '@angular/core';
import { SpinnerComponent, StompService } from '../../../../../sdk';
import { RegressionComponent } from '../regression.component';
import { RegressionTrendChartComponent } from '../regression-trend-chart/regression-trend-chart.component';

@Component({
    moduleId: module.id,
    selector: 'param-trend',
    templateUrl: './param-trend.html',
    styleUrls: ['./param-trend.css'],
    encapsulation: ViewEncapsulation.None
})
export class ParamTrendComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    @Input() data;
    @ViewChild('Spinner') spinner:SpinnerComponent;
    @ViewChild('imageChart') imageChart:RegressionTrendChartComponent;

    chartFlag: string = 'trend';   
    paramTrendDatas: any={};
    paramTrendConfig: any;

    chartDatas:any =[];

    chartInfo:any ={}
    dragMode:any='zoom';
    chartIds:any = []

    paramCount:number = 0;
    
    chartType:String = 'image';

    originType:String ='init';
    

    constructor(private _stompService: StompService) {

    }

    ngOnInit() {
    }
    
    ngAfterViewInit(){       
        this.chartInfo =
        { 
            "image": "aaaa",
            "showProgress": false,    //프로그레스 true/false
            "status": "Process",      // "Process" / Done:끝 
            "xMax": 23615,
            "xMin": 0,
            "x_axis_type": "DateTime",  //LabelCount / DateTime
            "yLabel": "Title",// Title
            "yMax": 104.57874015748031,
            "yMin": 49.63385826771655
        }
        let imageData =
        {
            xMin :1541030400000,
            xMax :1541116800000,
            yMin :'1',
            yMax :'10',
            image : 'data:image/png;base64,dd'
        }
        this.chartDatas=[{divId:"aa",chartDatas:[],imageData:imageData}];
        
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            this.datasReset();
            this.start(0);
        }
    }

    start(counter){
        let pramLength:number = 2;
        if(counter < pramLength){        
            setTimeout(()=>{            
                counter++;                
                this.send(pramLength);                
                this.start(counter);            
            }, 1000);        
        }        
    }
        
        
    zoomEvent(e:any){  
        let chartInfoDatas:any =
            {
                "type" : '',
                "height": 428,
                "width": 1615,
                "sessionId" :'' ,
                "fromdate":'',
                "todate":''
            };            
            chartInfoDatas.type = e.type;       
            chartInfoDatas.sessionId = e.sessionId;
            chartInfoDatas.fromdate = new Date(e.fromdate).getTime();
            chartInfoDatas.todate = new Date(e.todate).getTime();
            this.paramCount = 0;
            this.changedSend(chartInfoDatas);
    }
    

    send(pramLength){            
        let imageWidth:any = '';
        let imageHeight:any = '';
        let message={};
        
        this.spinner.showSpinner();
            imageWidth = parseInt(localStorage.getItem('imageWidth'));
            imageHeight = parseInt(localStorage.getItem('imageHeight'));
        message['parameters']={};
        message['parameters']['type'] = 'default';   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['sessionId'] = this.uuidv4();    
        message['parameters']['fromdate'] = 1536813537000;
        message['parameters']['todate'] = 1536817437000;   
        message['parameters']['imageWidth'] = imageWidth;
        message['parameters']['imageHeight'] = imageHeight;

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {    
                if(payload.chartFlag == 'image'){
                    this.paramCount ++;
                    this.originType = 'image';
                    this.chartType = 'image'  
                     this.trandchartInit(payload);   
                    this.addChartIds(payload.sessionId);
                    if(this.paramCount == pramLength){
                        this._stompService.finishSend(reply);
                        this.spinner.hideSpinner();
                    }
                }else{                      
                    this.originType = 'trend';
                    this.chartType = 'trend';             
                    this.paramCount ++;
                    this.addChartIds(payload.sessionId);
                    this.trandchartInit(payload);   
                
                    this.optionChange(1);
                    if(this.paramCount == pramLength){
                        this._stompService.finishSend(reply);
                        this.spinner.hideSpinner();
                    }                    
                }
            });
    }  
    
    changedSend(e:any){
        this.spinner.showSpinner();
        let imageWidth:any = '';
        let imageHeight:any = '';
        let message={};
        
        let imageChartSize = this.imageChart.getImageSize();
        imageWidth = imageChartSize.width;
        imageHeight = imageChartSize.height;       
        message['parameters']={};
        message['parameters']['type'] = e.type;   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['sessionId'] = e.sessionId;
        message['parameters']['fromdate'] = e.fromdate;
        message['parameters']['todate'] = e.todate;     
        message['parameters']['imageWidth'] = imageWidth;
        message['parameters']['imageHeight'] = imageHeight;
   

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {       
                if(payload.chartFlag == 'image'){
                    this.paramCount ++;
                    this.chartType = 'image'                  
                    for(let i=0; i<this.chartDatas.length; i++){
                        if(this.chartDatas[i].divId == payload.sessionId){
                            this.chartDatas[i].imageData = 
                            {
                                xMin : payload.imageChartData.xMin,
                                xMax : payload.imageChartData.xMax,
                                yMin : payload.imageChartData.yMin,
                                yMax : payload.imageChartData.yMax,
                                image : payload.imageChartData.image
                            }
                            break;
                        }
                    }
                    if(this.paramCount == this.chartIds.length){
                        this.paramCount = 0;
                        this._stompService.finishSend(reply);
                        this.spinner.hideSpinner();
                    }
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }else{
                    this.paramCount ++;                 
                    this.chartType = 'trend'     
                    for(let i=0; i<this.chartDatas.length; i++){
                        if(this.chartDatas[i].divId == payload.sessionId){
                            this.chartDatas[i].chartDatas = [];   
                            this.chartDatas[i].chartDatas = payload.trendData;                            
                            break;
                        }
                    }                  
                    if(this.paramCount == this.chartIds.length){
                        this.paramCount = 0;
                        this._stompService.finishSend(reply);
                        this.spinner.hideSpinner();
                    }
                }
            });

    }
    

    trandchartInit(e:any): void {
        if(this.chartType == 'image'){
            this.paramTrendDatas = {imageData:{
                xMin : e.imageChartData.xMin,
                xMax : e.imageChartData.xMax,
                yMin : e.imageChartData.yMin,
                yMax : e.imageChartData.yMax,
                image : e.imageChartData.image
                },
                divId:e.sessionId,
                chartDatas:[]
            }
        }else{           
            this.paramTrendDatas = {
                chartDatas:e.trendData,
                divId:e.sessionId
            };     
        }
       
        this.chartDatas.push(this.paramTrendDatas);   

    }

    addChartIds(sessionId){
        this.chartIds.push(sessionId);
    }

    uuidv4() {
        return (
            'a' +
            'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0,
                    v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            })
        );
    }

    getImageSize(){        
        return {width:$('#aa').find('.nsewdrag').width(),height:$('#aa').find('.nsewdrag').height()};
    }

    optionChange(e:any){  
        if(e==1){//zoom        
            this.dragMode = 'zoom';  
        }else{//regression            
            this.dragMode = 'select';            
        }
    }

    datasReset(){
        let imageWidth:any = '';
        let imageHeight:any = '';
        let imageChartSize = this.imageChart.getImageSize();
        imageWidth = imageChartSize.width;
        imageHeight = imageChartSize.height;            
        localStorage.setItem('imageWidth', imageWidth.toString());
        localStorage.setItem('imageHeight', imageHeight.toString());         
        this.paramCount = 0;
        this.dragMode = 'zoom';
        this.chartIds = [];
        this.chartDatas = [];
    }

    ngOnDestroy() {

    }
}