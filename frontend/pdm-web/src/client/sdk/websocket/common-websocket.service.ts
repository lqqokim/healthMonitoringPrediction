import { Injectable } from '@angular/core';
import { $WebSocket } from './angular2-websocket';
import { RestfulUtil } from '../utils/restful.util';

@Injectable()
export class CommonWebSocketService {
    
    private _websocket: $WebSocket;

	createWebSocket(postfixUri: string, userId: string): any {
        let url = '';
        let config = JSON.parse('<%= ENV_CONFIG %>');
        if (config && config.ENV) {
            if (config.ENV === 'DEV') {
                url =  `ws://localhost:8080${RestfulUtil.getAPIAddress()}service/${postfixUri}/${userId}`;
            } else if (config.ENV === 'PROD') {
		        url = `ws://${window.location.host}${RestfulUtil.getAPIAddress()}service/${postfixUri}/${userId}`;
            }
        } else {
            url = `ws://localhost:8080${RestfulUtil.getAPIAddress()}service/${postfixUri}/${userId}`;
        }

        console.log('websocket url:', url);
        this._websocket = new $WebSocket(url);

        const defer = jQuery.Deferred();
        const promise = defer.promise();
        promise.websocket = this._websocket;
        return promise;
	}

    /**
     * mode is 3 type 
     *  - WebSocketSendMode.Direct
     *  - WebSocketSendMode.Promise
     *  - WebSocketSendMode.Observable => Default mode
     */
    send(request: any): any {
        if (!this._websocket) {
            return new Error('You must call craeteWebSocket(<url>)');
        }
        // return this._websocket.send(JSON.stringify(request), WebSocketSendMode.Direct);
        return this._websocket.send(JSON.stringify(request));
    }

    listen(messageCb: any, errorCb?: any, closeCb?: any): any {
        if (!messageCb) {
            return new Error('You must set message callback function');
        }
        
        this._websocket.onMessage(messageCb, {autoApply: false});

        if (errorCb) {
            this._websocket.onError(errorCb);
        }
        if (closeCb) {
            this._websocket.onClose(closeCb);
        }
    }

    getDataStream(): any {
        return this._websocket.getDataStream();
    }

    close() {
        if (this._websocket) {
            this._websocket.close(true);
        }
    }

    reconnect() {
        if (this._websocket) {
            this._websocket.reconnect();
        }
    }

    isOpened() {
        if (this._websocket) {
            return this._websocket.isOpened();
        }
        return false;
    } 
}