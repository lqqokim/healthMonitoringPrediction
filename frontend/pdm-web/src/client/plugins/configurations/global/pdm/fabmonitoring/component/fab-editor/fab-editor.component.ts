
import { Component,ViewChild,ElementRef,OnInit,EventEmitter,Output, Input, OnChanges,AfterViewInit,ViewEncapsulation } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FabInfo } from './fabInfo';

@Component({
  moduleId:module.id,
  selector: 'fab-editor',
  templateUrl: `fab-editor.component.html`,
  
  styleUrls: [`fab-editor.component.css`],
  encapsulation:ViewEncapsulation.None
})
export class FabEditorComponent implements OnInit, OnChanges,AfterViewInit{

    @Input() fabInfo:FabInfo=new FabInfo();
    @Input() mode="editor";
    @ViewChild("fabcanvas") fabcanvas:ElementRef;
    // @Output() save: EventEmitter<any> = new EventEmitter();

    selectedItem =null ;
    rateWidth = 1;
    rateHeight = 1;
    currWidth;
    currHeight;
    

    actions=[];
    actionsKey={};

    locationActions=[];
    locationActionsKey={};

    

    statusNames =['normal','alarm','warning'];

    locationSeq = 0;

    isSimulationStop = true;

    constructor(){ }


    ngOnInit(){ 
        window.addEventListener("resize", ()=>{
            this.onResize();
        });
    }

    ngOnChanges() {
        this.setData();
    }
    ngAfterViewInit(){

        $( "#draggable" ).draggable({ cursor: "move"});


        // $( "#draggable" ).draggable({ cursor: "move" });
        $('#file').change((evt)=>{
            var img = $('<img id="temp_image">');
            // var div = $('.fab-canvas');
            var div = $(this.fabcanvas.nativeElement);
            $(document.body).append(img);
        
            var reader = new FileReader();
            reader.onload = ((img)=> { 
                return (ev)=> {
                    var image = ev.target.result;
                    img[0].src = image;
                    div.css('background-image', 'url("' + image + '")');
                    this.fabInfo.image =  image;
                    $('#temp_image').remove();
                };
            })(img);
        
            var file = evt.target.files[0];
            reader.readAsDataURL(file);
        });


   

    }
    setData(){
        // this.isSimulationStop = true;
        this.clearAction();
        if(this.fabInfo==null){
            return ;
        }
        if(this.fabInfo.image!=null){
            // var div = $('.fab-canvas');
            let div = $(this.fabcanvas.nativeElement);
            div.css('background-image', 'url("' + this.fabInfo.image + '")');
        }
        setTimeout(()=>{
            var div = $(this.fabcanvas.nativeElement);
            this.currWidth=div.width();
            this.currHeight=div.height();
            if(this.fabInfo.width==null){
                this.fabInfo.width =  this.currWidth;
                this.fabInfo.height =  this.currHeight;
                this.rateWidth = 1;
                this.rateHeight = 1;
            }else{
                this.rateWidth = this.currWidth/this.fabInfo.width;
                this.rateHeight = this.currHeight/this.fabInfo.height;
            }
    
        },500);

    }

    addPosition(){
        const item = {left:'100',top:'100',name:new Date().getTime()};
        this.fabInfo.datas.push(item);
        // var div = $('.fab-canvas');
        // let name = new Date().getTime();
        // div.append(`<div id='${name}' class='position-rectangle'>  <p>${name}</p> </div>`);
        // $( `#${name}` ).draggable({ cursor: "move" });
        this.selectedItem = item;
    }
    getXByName(name,myElementId){
        var div = $(this.fabcanvas.nativeElement);
        let x =parseInt(div.find('#'+name).css('left'));
        let myWidth = div.find('#'+myElementId).width();
        if(myWidth!=null){
            x = x-myWidth/2;
        }
        return x;
    }
    getYByName(name,myElementId,type){
        var div = $(this.fabcanvas.nativeElement);
        let y =parseInt(div.find('#'+name).css('top'));
        y= y + div.find('#'+name).height()/2;
        let myHeight = div.find('#'+myElementId).height();
        if(myHeight!=null){
            if(type==null){
                y = y-myHeight/2;
            }else{
                y = y-myHeight;
            }
            
        }
        return y;
    }
    onResize(){
        if(this.fabInfo==null){
            return ;
        }
        var div = $(this.fabcanvas.nativeElement);
        let newCurrWidth=div.width();
        let newCurrHeight=div.height();

        for(let i=0;i<this.fabInfo.datas.length;i++){
            this.fabInfo.datas[i].left = this.fabInfo.datas[i].left * this.rateWidth* newCurrWidth /this.currWidth;
            this.fabInfo.datas[i].top = this.fabInfo.datas[i].top * this.rateHeight*newCurrHeight/this.currHeight; 
        }
        this.rateHeight = 1;
        this.rateWidth = 1;
        this.currHeight = newCurrHeight;
        this.currWidth = newCurrWidth;
        this.fabInfo.width = this.currWidth;
        this.fabInfo.height = this.currHeight
    }
    onMousedown(event,item){
        this.selectedItem = item;
    }
    onMouseup(event,item){
        // this.selectedItem = item;
        if(event.target.tagName==="P"){
            item.left = parseInt($(event.target.parentElement).css('left'));
            item.top = parseInt($(event.target.parentElement).css('top'));
    
        }else{
            item.left = parseInt($(event.target).css('left'));
            item.top = parseInt($(event.target).css('top'));
        }
    }
    // onSave(){
    //     // let data = {image:$('.fab-canvas').css('background-image'),
    //     // datas:this.fabInfo.datas,
    //     // width:$('.fab-canvas').width(),height:$('.fab-canvas').height() };
    //     if(this.fabInfo.rawid==null){
    //         this.save.emit({status:'create',fabInfo:this.fabInfo});
    //     }else{
    //         this.save.emit({status:'update',fabInfo:this.fabInfo});
    //     }
    // }
    // onDelete(){
    //     this.save.emit({status:'delete',fabInfo:this.fabInfo});
    // }


    locations = [];
    simulationStop(){
        this.isSimulationStop = true;
    }
    simulationStart(){
        this.locations =[];
        this.isSimulationStop = false;
        for(let i=0;i<this.fabInfo.datas.length;i++){
            this.locations.push(this.fabInfo.datas[i].name);
        }
        this.moveaction();
        this.locationStatusAction();
        this.simulation();
        return !this.isSimulationStop;
    }
    simulation(){
        if(this.isSimulationStop){
            this.clearAction();
           return;
        }
        this.moveaction();
        this.locationStatusAction();
        // setInterval(()=>{
            setTimeout(()=>{
                // this.moveaction();

                this.simulation();                
        },5000);

    }
    moveaction(){
        let count = this.fabInfo.datas.length;

        for(let i=0;i<count/2;i++){
            let index =Math.floor(Math.random() * 3); 
            let info = "Name: EQP"+i.toString()+'\n'+ "Status: "+this.statusNames[index]+'\n'+"Location: "+this.locations[(this.locationSeq+i)%count];
            this.setAction("EQP"+i.toString(),this.locations[(this.locationSeq+i)%count],this.statusNames[index],info);
                
        }
        this.locationSeq ++;
        if(this.locationSeq>100000){
            this.locationSeq = 0;
        }
    }
    locationStatusAction(){
        let count = this.fabInfo.datas.length;

        for(let i=0;i<count;i++){
            const index =Math.floor(Math.random() * 3); 
            const speed = Math.floor(Math.random()*100);
            const warning_spec = 0.8 + this.randomRange(-100,100)/1000;
            const alarm_spec = 1;
            const maxvalue = 1.3;
            let value = 0;
            if(this.statusNames[index]=="alarm"){
                value = this.randomRange(100,130)/100;
            }else if(this.statusNames[index]=="warning"){
                value = this.randomRange(warning_spec*100,99)/100;
            }else{
                value = this.randomRange(100,(warning_spec-0.01)*100)/100;
            }
            let info = "Name: EQP"+i.toString()+'\n'+ "Status: "+this.statusNames[index]+'\n'+"Location: "+this.locations[i];

            this.setLocationAction(this.locations[i],this.statusNames[index],speed ,info,warning_spec,alarm_spec,value,maxvalue);
                
        }
    }
    randomRange(min,max) {
        return  Math.floor((Math.random() * (max - min + 1)) + min );
    }
      
    public getDatas(){
        return this.fabInfo;
    }
    public clearAction(){
        this.actions =[];
        this.actionsKey ={};
        this.clearLocationAction();
    }
    public clearLocationAction(){
        this.locationActions =[];
        this.locationActionsKey ={};
    }
    public setAction(name,locationName,status,info){
        if(this.actionsKey[name]){
            this.actionsKey[name].locationName = locationName;
            this.actionsKey[name].status = status;
            this.actionsKey[name].info = info;
        }else{
            this.actions.push({name:name,locationName:locationName,status:status,info:info});
            this.actionsKey[name] = this.actions[this.actions.length-1];
        }
        
    }
    public setLocationAction(locationName,status,speed,info,warning_spec,alarm_spec,value,maxvalue){
        if(this.locationActionsKey[locationName]){
            this.locationActionsKey[locationName].name ="loc_"+ locationName;
            this.locationActionsKey[locationName].locationName = locationName;
            this.locationActionsKey[locationName].status = status;
            this.locationActionsKey[locationName].speed = speed;
            this.locationActionsKey[locationName].info = info;
            this.locationActionsKey[locationName].data = {warning:warning_spec,alarm:alarm_spec,value:value,maxvalue:maxvalue};

        }else{
            this.locationActions.push({locationName:locationName,status:status,speed:speed,info:info});
            this.locationActionsKey[locationName] = this.locationActions[this.locationActions.length-1];
        }
        
    }

}
