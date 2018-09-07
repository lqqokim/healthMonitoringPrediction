
import { Component,ViewChild,ElementRef,OnInit,EventEmitter,Output, Input, OnChanges,AfterViewInit,ViewEncapsulation } from '@angular/core';
import { Observable }     from 'rxjs/Observable';
import { FabInfo } from './fabInfo';
import { elementDef } from '@angular/core/src/view';

@Component({
  moduleId:module.id,
  selector: 'fab-editor',
  templateUrl: `fab-editor.component.html`,
  
  styleUrls: [`fab-editor.component.css`],
  encapsulation:ViewEncapsulation.None
})
export class FabEditorComponent implements OnInit, OnChanges, AfterViewInit{

    @Input() fabInfo:any=new FabInfo();
    @Input() mode="editor";
    @ViewChild("fabcanvas") fabcanvas:ElementRef;
    @ViewChild("property") property:ElementRef;
    // @Output() save: EventEmitter<any> = new EventEmitter();

    jq_fabCanvas:any = undefined;
    jq_fabCanvas_target:any = {};
    jq_fabCanvas_my:any = {};

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


    locations = [];
    locationKeys = {};

    constructor(){ }

    // fabCanvas 셀렉터 퍼포먼스 up (10 ~ 100배 select speed up)
    getFabCanvas(){
        if( this.jq_fabCanvas === undefined ){
            this.jq_fabCanvas = $(this.fabcanvas.nativeElement);
        }
        return this.jq_fabCanvas;
    }
    getFabCanvas_target( jqueryElem, key ){
        if( !this.jq_fabCanvas_target.hasOwnProperty(key) ){
            this.jq_fabCanvas_target[key] = jqueryElem.find(`#${key}`);
        }
        return this.jq_fabCanvas_target[key];
    }
    getFabCanvas_my_size( jqueryElem, key, type ){
        if( !this.jq_fabCanvas_my.hasOwnProperty(key) ){
            var elem = jqueryElem.find(`#${key}.positionInfo`);

            // 엘리먼트가 없으면 0
            if( elem.length == 0 ){ return 0; }

            // 절반 크기 (이미지 중앙 위치)
            this.jq_fabCanvas_my[key] = {
                w: Math.round(elem.width() * 0.5),
                h: Math.round(elem.height() * 0.5)
            };
        }
        return this.jq_fabCanvas_my[key][type];
    }
    fabCanvas_elem_destroy(){
        for( var key in this.jq_fabCanvas_target ){
            delete this.jq_fabCanvas_target[key];
        }

        for( var key in this.jq_fabCanvas_my ){
            delete this.jq_fabCanvas_target[key];
        }
    }

    ngOnInit(){ 
        window.addEventListener("resize", ()=>{
            this.onResize();
        });
    }

    ngOnChanges() {
        this.setData();
    }

    ngAfterViewInit(){
        $( this.property.nativeElement ).draggable({ cursor: "move"});

        // $( "#draggable" ).draggable({ cursor: "move" });
        $('#file').change((e)=>{
            // let div = $('.fab-canvas');
            let file = e.target.files[0];
            if( file === undefined ){ return; }

            let div = this.getFabCanvas();
            let name = file.name;
            let progressbar = $(e.target).siblings('[filename] > [progress]');

            $(e.target).siblings('[fileName]').html( name );
        
            let reader = new FileReader();
            reader.onloadstart = () => {
                progressbar.attr('progress', 'on');
            };
            reader.onload = ()=>{ 
                const imgUrl = reader.result;
                div.css({ backgroundImage: `url(${imgUrl})` });
                this.fabInfo.image = imgUrl;
                progressbar.attr('progress', '');
            };
            reader.onprogress = (e)=>{
                let loaded = Math.round((e.loaded / e.total) * 100);
                progressbar.css({width:`${loaded}%`});
            };
        
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
        }else{
            var div = $(this.fabcanvas.nativeElement);
            div.css('background-image', '');

        }

        setTimeout(()=>{
            var div = $(this.fabcanvas.nativeElement);
            this.currWidth=div.width();
            this.currHeight=div.height();
            if(this.fabInfo.width==null){
                this.fabInfo.width = this.currWidth;
                this.fabInfo.height = this.currHeight;
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

    getXByName(name, myElementId){
        let div = this.getFabCanvas();
        let target = this.getFabCanvas_target( div, name );
        let myWidth:number = this.getFabCanvas_my_size( div, myElementId, 'w' );

        return (
            parseInt(target.css('left'), 10) + (target.width() * 0.5) - myWidth
        );
    }
    getYByName(name, myElementId){
        let div = this.getFabCanvas();
        let target = this.getFabCanvas_target( div, name );
        let myHeight:number = this.getFabCanvas_my_size( div, myElementId, 'h' );

        return (
            parseInt(target.css('top'), 10) + (target.height() * 0.5) - myHeight
        );
    }

    onResize(){
        if(this.fabInfo==null){
            return ;
        }
        var div = this.getFabCanvas();

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


    simulationStop(){
        this.isSimulationStop = true;
        this.fabCanvas_elem_destroy();
        this.clearAction();
    }
    simulationStart(){
        this.locations =[];
        this.isSimulationStop = false;
        if(this.fabInfo==null) return this.isSimulationStop;
        for(let i=0;i<this.fabInfo.datas.length;i++){
            this.locations.push(this.fabInfo.datas[i].name);
			this.locationKeys[this.fabInfo.datas[i].name] = this.fabInfo.datas[i];
       }
        // this.moveaction();
        this.locationStatusAction();
        
        this.simulation();
        return !this.isSimulationStop;
    }
    simulation(){
        if(this.isSimulationStop){
            this.clearAction();
           return;
        }
        // this.moveaction();
        this.locationStatusAction();
        // setInterval(()=>{
            setTimeout(()=>{
                // this.moveaction();

                this.simulation();                
        },5000);

    }
    initLayout(){
        this.locations =[];
        this.isSimulationStop = false;
        if(this.fabInfo==null) return ;
        for(let i=0;i<this.fabInfo.datas.length;i++){
            this.locations.push(this.fabInfo.datas[i].name);
            this.locationKeys[this.fabInfo.datas[i].name] = this.fabInfo.datas[i];
        }
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
            const displayvalue = Math.floor(Math.random()*100)+" km";
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
            let info = "Param: param"+i.toString()+'\n'+'Value:'+value+'\n'+ "Status: "+this.statusNames[index] +'\n'+"Location: "+this.locations[i];

            this.setLocationAction(this.locations[i],this.statusNames[index],displayvalue ,info,warning_spec,alarm_spec,value,maxvalue);
                
        }
    }
    getLocationStatusSimul(){
        let count = this.fabInfo.datas.length;

        let locations=[];
        for(let i=0;i<count;i++){
            const index =Math.floor(Math.random() * 3); 
            const displayvalue = Math.floor(Math.random()*100)+" km";
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
            let info = "Param: param"+i.toString()+'\n'+'Value:'+value+'\n'+ "Status: "+this.statusNames[index] +'\n'+"Location: "+this.locations[i];

            // this.setLocationAction(this.locations[i],this.statusNames[index],displayvalue ,info,warning_spec,alarm_spec,value,maxvalue);

            locations.push({locationName:this.locations[i],status:this.statusNames[index],displayvalue:displayvalue,info:info,warning_spec:warning_spec,alarm_spec:alarm_spec,value:value,maxvalue:maxvalue});
        }
        return locations;

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
    public setLocationActions(locations){
        for(let i=0;i<locations.length;i++){
            let locationInfo = locations[i];
            this.setLocationAction(locationInfo.locationName,locationInfo.status,locationInfo.displayvalue,locationInfo.info,
                locationInfo.warning_spec,locationInfo.alarm_spec,locationInfo.value,locationInfo.maxvalue);
        }

    }
    public setLocationAction(locationName,status,displayvalue,info,warning_spec,alarm_spec,value,maxvalue){
        if(this.locationKeys[locationName]==null) return ;
        
        if(this.locationActionsKey[locationName]){
            this.locationActionsKey[locationName].name ="loc_"+ locationName;
            this.locationActionsKey[locationName].locationName = locationName;
            this.locationActionsKey[locationName].status = status;
            this.locationActionsKey[locationName].displayvalue = displayvalue;
            this.locationActionsKey[locationName].info = info;
            this.locationActionsKey[locationName].data = {warning:warning_spec,alarm:alarm_spec,value:value,maxvalue:maxvalue};

        }else{
            this.locationActions.push({locationName:locationName,status:status,displayvalue:displayvalue,info:info});
            this.locationActionsKey[locationName] = this.locationActions[this.locationActions.length-1];
        }        
    }

}
