import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation, ViewChild, Input, SimpleChanges, AfterViewInit } from '@angular/core';
import { SpinnerComponent, StompService } from '../../../../../sdk';

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

    chartFlag: string = 'image';   
    paramTrendDatas: any={};
    paramTrendConfig: any;

    chartDatas:any =[];

    chartInfo:any ={}
    dragMode:any='zoom';
    chartIds:any = []

    paramCount:number = 0;
    

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
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes['data']['currentValue']) {
            const data = changes['data']['currentValue'];
            // this.drawParamTrend(data);
            // this.send();                  
            this.datasReset();
            this.start(0);
        }
    }

    start(counter){
        let pramLength:number = 5;
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
                "series" :'' ,
                "fromdate":'',
                "todate":''
            };
            chartInfoDatas.type = e.type;       
            chartInfoDatas.sessionId = e.sessionId;
            chartInfoDatas.series = e.series
            chartInfoDatas.fromdate = e.datas[0];
            chartInfoDatas.todate = e.datas[1];
            this.changedSend(chartInfoDatas);
    }
    

    send(pramLength){            
        let imageWidth:any = '';
        let imageHeight:any = '';
        let message={};
        
        this.spinner.showSpinner();
        if(this.chartFlag == 'trend'){
            imageWidth = parseInt(localStorage.getItem('imageWidth'));
            imageHeight = parseInt(localStorage.getItem('imageHeight'));
        }else{
            imageWidth = document.querySelector('.chart-body').clientWidth - 50;
            imageHeight = document.querySelector('.chart-body').clientHeight - 10;
            localStorage.setItem('imageWidth', imageWidth.toString());
            localStorage.setItem('imageHeight', imageHeight.toString());
        }
        message['parameters']={};
        message['parameters']['type'] = 'default';   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['sessionId'] = this.uuidv4();
        // message['parameters']['fromdate'] = this.data.timePeriod.from;
        // message['parameters']['todate'] = this.data.timePeriod.to;        
        message['parameters']['fromdate'] = 1536813537000;
        message['parameters']['todate'] = 1536817437000;   
        message['parameters']['imageWidth'] = imageWidth;
        message['parameters']['imageHeight'] = imageHeight;

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {    
                if(payload.chartFlag == 'image'){
                    this.paramCount ++;
                    this.chartFlag = 'image';
                    this.addChartIds(payload.sessionId);
                    localStorage.setItem('imageWidth', imageWidth.toString());
                    localStorage.setItem('imageHeight', imageHeight.toString());
                    this.chartInfo = payload.imageChartData;    
                    if(this.paramCount == pramLength){
                        this._stompService.finishSend(reply);
                        this.spinner.hideSpinner();
                    }
                }else{
                    console.warn('trend');                   
                    this.paramCount ++;
                    this.trandchartInit(payload.trendData,payload.sessionId);   
                    this.chartFlag = 'trend';
                    this.addChartIds(payload.sessionId);
                
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
        
        if(this.chartFlag == 'trend'){
            imageWidth = parseInt(localStorage.getItem('imageWidth'));
            imageHeight = parseInt(localStorage.getItem('imageHeight'));
        }else{
            imageWidth = document.querySelector('.chart-body').clientWidth - 50;
            imageHeight = document.querySelector('.chart-body').clientHeight - 10;
        }
        message['parameters']={};
        message['parameters']['type'] = e.type;   
        message['parameters']['fabId'] = this.data.fabId;
        message['parameters']['paramId'] = this.data.paramId;
        message['parameters']['sessionId'] = e.sessionId;
        message['parameters']['series'] = e.series;
        message['parameters']['fromdate'] = e.fromdate;
        message['parameters']['todate'] = e.todate;     
        message['parameters']['imageWidth'] = imageWidth;
        message['parameters']['imageHeight'] = imageHeight;
   

    let reply = this._stompService.send(null,'getRegressionTrend',message,payload => {       
                if(payload.chartFlag == 'image'){
                    this.chartFlag = 'image';
                    this.addChartIds(payload.sessionId);
                    this.chartInfo = payload.imageChartData;
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }else{
                    console.warn('trend');
                    localStorage.setItem('imageWidth', imageWidth.toString());
                    localStorage.setItem('imageHeight', imageHeight.toString());                     
                    this.trandchartInit(payload.trendData,payload.sessionId);       
                    this.chartFlag = 'trend';                           
                    this.addChartIds(payload.sessionId);
                    this.optionChange(1);
                    this._stompService.finishSend(reply);
                    this.spinner.hideSpinner();
                }
            });

    }
    

    trandchartInit(data,sessionId): void {
        this.paramTrendDatas = {
            chartDatas:data,
            divId:sessionId
        };     
        this.chartDatas.push(this.paramTrendDatas);
        console.warn(this.chartDatas);
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

    optionChange(e:any){  
        console.warn(e); 
        if(e==1){//zoom        
            this.dragMode = 'zoom';  
        }else{//regression            
            this.dragMode = 'select';            
        }
    }

    datasReset(){
        this.chartFlag = 'image';
        this.chartFlag = 'trend';
        this.paramCount = 0;
        this.dragMode = 'zoom';
        this.chartIds = [];
        this.chartDatas = [];
    }

    ngOnDestroy() {

    }
}