import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { UUIDUtil } from '../utils/uuid.util';
import { RestfulUtil } from '../utils/restful.util';

import 'stompjs';

declare let Stomp:any;
declare var SockJS: any;

@Injectable()
export class StompService {

    private _stompClient;
    private _stompSubject  = new Subject();

    // http websocket url�용�여 connect륄한 method
    public connect(_webSocketUrl: string) : void {
        let self = this;

        if(_webSocketUrl==null){
            let url = '';
            let config = JSON.parse('<%= ENV_CONFIG %>');
            if (config && config.ENV) {
                if (config.ENV === 'DEV') {
                    url =  `http://localhost:8080${RestfulUtil.getAPIAddress()}service/socket/portal-endpoint`;
                } else if (config.ENV === 'PROD') {
                    url = `http://${window.location.host}${RestfulUtil.getAPIAddress()}service/socket/portal-endpoint`;
                }
            } else {
                url = `http://localhost:8080${RestfulUtil.getAPIAddress()}service/socket/portal-endpoint`;
            }
            _webSocketUrl = url;
        }

        //let webSocket = new WebSocket(_webSocketUrl);
        let webSocket = new SockJS(_webSocketUrl);
        this._stompClient = Stomp.over(webSocket);
        this._stompClient.connect({}, function (frame) {
            // server �서 '/topic/summarytrace' ��send�면 �곳�서 subscribe
            // self._stompClient.subscribe('/topic/summarytrace', function (stompResponse) { 
            //     // stompResponse = {command, headers, body with JSON 
            //     // reflecting the object returned by Spring framework}
            //     self._stompSubject.next(JSON.parse(stompResponse.body));
            // });
        });
    }

    public send(preId,subject:string,message:any,callback) {
        /**
         * sample data
         * 
            let msg = '{"replySubject":"summarytrace",
            "parameters":{"moduleIds":["BISTel/EIC/CUBE/PHOTO:PHOTO01/CH_D"],
            "parameters":["CHD_Bake_LOT_MAX"],"recipeIds":["RCP5"],
            "recipeSteps":["3"],"fromDate":1479984664106,
            "toDate":1480589464106,"xMin":1479984664106,
            "xMax":1480589464106,"yMin":0,"yMax":100,"width":1024,"height":768}}"';
         * 
         */

        let stompSubject  = new Subject();
        let id = preId;
        if(id==null){
            id = UUIDUtil.generateID();
        }
        
        message['id'] = id;
        message["replySubject"] ="/topic/"+id;
        let sendDatas = [];
        let sendStomp = this._stompClient;
        let stomReply;
        if(preId==null){
            stomReply = this._stompClient.subscribe('/topic/'+id, function (stompResponse) { 
                // stompResponse = {command, headers, body with JSON 
                // reflecting the object returned by Spring framework}
                let payload = JSON.parse(stompResponse.body);
                // if(id!=payload['id']) {
                //     console.log("not match id:"+payload['id']);
                //     return;
                // }
                // if(payload['status']=="RequestNext"){
                //     let sendmessage = sendDatas[0].message;
                //     sendmessage['sequence'] = sendDatas[0].sequence;
                //     sendmessage['status'] = sendDatas[0].status;
                //     sendmessage['parameterData'] = sendDatas[0].parameterData;
                //     sendDatas.splice(0,1);
                //     sendStomp.send("/app/"+subject, {}, JSON.stringify(sendmessage));
                // }else{
                    callback(payload);
                    stompSubject.next(payload);
                // }
            });
        }
        
        // let str_message = JSON.stringify(message.parameters);
        // message.parameters=null;
        // let sendCount = 1;
        // sendCount =Math.round( (str_message.length)/10000+0.5);
        // for(let i=0;i<sendCount;i++){
        //     //message['sequence'] =i+1;
        //     let sequence = i+1;
        //     //message.paramterData =str_message.substr(i*10000,10000);
        //     let messageString =str_message.substr(i*10000,10000);
        //     let status = "";
        //     if(i+1==sendCount){
        //         //message['status'] ="Finish";
        //         status = "Finish";
        //     }else if(i==0){
        //         //message['status'] ="First";
        //         status = "First";
        //     }else{
        //         //message['status'] ="Progress";
        //         status ="Progress";
        //     }
        //     message.parameterData="";
        //     sendDatas.push({message:message, parameterData:messageString,sequence:sequence,status:status});            
        // }
        let sendmessage = message;
        // sendmessage['sequence'] = sendDatas[0].sequence;
        // sendmessage['status'] = sendDatas[0].status;
        // sendmessage['parameterData'] = sendDatas[0].parameterData;
        // sendDatas.splice(0,1);
        this._stompClient.send("/app/"+subject, {}, JSON.stringify(sendmessage));
        
        // let stomReply = stompSubject.asObservable().subscribe(payload=>{
        //     if(id!=payload['id']) {
        //         console.log("not match id:"+payload['id']);
        //         return;
        //     }
        //     callback(payload);
        // });
        // return stomReply;
        return id;
    }

    public finishSend(stompReply:Subscription){
        if(stompReply!=null)
           stompReply.unsubscribe(); 
           
    }

    /**
     * url is http://localhost:8080/portal/service/socket/portal-endpoint
     * @see analysis-summary-trend.component
     */
    private _getWebSocketUrl() {
        const url = `${window.location.protocol}//${window.location.host}${RestfulUtil.getAPIAddress()}service${A3_CONFIG.WEBSOCKET.URL}`;
        
    }

    public getObservable() : Observable<any> {
        return this._stompSubject.asObservable();
    }
}