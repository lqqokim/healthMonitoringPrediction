
import { Component,ViewChild,ElementRef,OnInit,EventEmitter,Output, Input, OnChanges,AfterViewInit,ViewEncapsulation } from '@angular/core';
import { Observable }     from 'rxjs/Observable';

@Component({
  moduleId:module.id,
  selector: 'barchart',
  templateUrl: `barchart.component.html`,
  
  styleUrls: [`barchart.component.css`],
  
})
export class BarchartComponent implements OnInit, OnChanges,AfterViewInit{

    @Input() data; //data ={warning:0.8,alarm:1.0,value:1.1,maxvalue:1.3};

    chartId = this.guid();

    constructor(){ }

    normal_y=0;
    warning_y=0;
    alarm_y=0
    normal_height;
    warning_height;
    alarm_height;

    ngOnInit(){ 
        
    }

    ngOnChanges() {
        if(this.data!=null){
            this.draw();
        }
        
    }
    ngAfterViewInit(){
      
        
   

    }
    draw(){
        let tempWidth = $("#"+this.chartId).width();
        let tempHeight =$("#"+this.chartId).height();

        let data = this.data;

        if(data.alarm<data.value){
            this.normal_height = tempHeight/data.maxvalue * data.warning;
            this.warning_height = tempHeight/data.maxvalue * data.alarm -this.normal_height;
            this.alarm_height = tempHeight/data.maxvalue * data.value - this.normal_height - this.warning_height;

            this.normal_y = tempHeight - this.normal_height;
            this.warning_y = this.normal_y - this.warning_height;
            this.alarm_y = this.warning_y - this.alarm_height;

        }else if(data.warning<data.value){
            this.normal_height = tempHeight/data.maxvalue * data.warning;
            this.warning_height = tempHeight/data.maxvalue * data.value -this.normal_height;
            this.alarm_height =0;
            this.normal_y = tempHeight - this.normal_height;
            this.warning_y = this.normal_y - this.warning_height;
            this.alarm_y=0;

        }else{
            this.normal_height = tempHeight/data.maxvalue * data.value;
            this.alarm_height =0;
            this.warning_height =0;
            this.normal_y = tempHeight - this.normal_height;
            this.warning_y = 0;
            this.alarm_y=0;
        }

    }

    guid() {
      return 'xxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return "C" + v.toString(16);
      });
    }
}


