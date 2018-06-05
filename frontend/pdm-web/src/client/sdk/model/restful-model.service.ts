import { Injectable } from '@angular/core';
import { Headers, RequestOptions, RequestMethod, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { SessionStore } from '../session/session-store.service';
import { InjectorUtil } from '../utils/injector.util';
import { RestfulOptions, RestfulParamsOptions } from './model.type';

import 'rxjs/add/operator/toPromise';
import { Util } from '../utils/utils.module';

@Injectable()
export class RestfulModelService {

    private _apiAddress: string;

    constructor(
    	private http: Http
	) {
        this._apiAddress = Util.Restful.getAPIAddress();
    }

    /**
     * GET method
     *
     * 1) additional uri path
     */
    // GET({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulOptions) {
    GET(option: RestfulOptions) {
        let opt = this._createOptions(option.params, {}, RequestMethod.Get);
        return this.http.get(this._createUrl(option), opt.options)
          .map((response: any) => this._toJson(response))
          .catch(this._handleError)
          .toPromise();
    }

    // rxGET({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulOptions) {
    rxGET(option: RestfulOptions) {
        let opt = this._createOptions(option.params, {}, RequestMethod.Get);
        return this.http.get(this._createUrl(option), opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError);
    }

    /**
     * POST method
     *
     * 1) params json
     * 2) additional uri path
     * 3) optionalHeader info json
     */
    // POST({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulParamsOptions) {
    POST(option: RestfulParamsOptions) {
        let opt = this._createOptions(option.params, option.header, RequestMethod.Post);
        return this.http
            .post(this._createUrl(option), opt.body, opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
    }

    // POST({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulParamsOptions) {
    binaryPOST(option: RestfulParamsOptions) {
        let opt = this._createOptions(option.params, option.header, RequestMethod.Post);
        return this.http
            .post(this._createUrl(option), opt.body, opt.options)
			//.map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
    }

    // rxPOST({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulParamsOptions) {
    rxPOST(option: RestfulParamsOptions) {
        let opt = this._createOptions(option.params, option.header, RequestMethod.Post);
        return this.http
            .post(this._createUrl(option), opt.body, opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError);
    }
    
    /******************** */
    /* New Authority code */
    /******************** */
    rxPOSTLogin(url,body,header) {
        return this.http
            .post(url, body, {headers:header})
			.map((response: any) => this._toJson(response))
            .catch(this._handleError);
    }
    

    /**
     * PUT method
     * return value just responsoe object, not JSON
     */
    // PUT({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulParamsOptions) {
    PUT(option: RestfulParamsOptions) {
        let opt = this._createOptions(option.params, option.header, RequestMethod.Put);
        return this.http
            .put(this._createUrl(option), opt.body, opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
    }

    // rxPUT({ uriPath, params, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulParamsOptions) {
    rxPUT(option: RestfulParamsOptions) {
        let opt = this._createOptions(option.params, option.header, RequestMethod.Put);
        return this.http
            .put(this._createUrl(option), opt.body, opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError);
    }

    /**
     * DELETE method
     * return value just responsoe object, not JSON
     */
    // DELETE({ uriPath, params = {}, querystring = {}, header = {}, isRemoveServicePath = false }: RestfulOptions) {
    DELETE(option: RestfulOptions) {
        let opt = this._createOptions(option.params, {}, RequestMethod.Delete);
        return this.http
            .delete(this._createUrl(option), opt.options)
            .map((response: any) => this._toJson(response))
            .catch(this._handleError)
            .toPromise();
    }

    // rxDELETE({ uriPath, params = {}, querystring = {}, header = {}, isRemoveServicePath = false }:RestfulOptions) {
    rxDELETE(option: RestfulOptions) {
        let opt = this._createOptions(option.params, {}, RequestMethod.Delete);
        return this.http
            .delete(this._createUrl(option), opt.options)
			.map((response: any) => this._toJson(response))
            .catch(this._handleError);
    }

	/**
	 * Create Url
	 */
	private _createUrl(option: RestfulOptions | RestfulParamsOptions): string {
		let url: string = '';
			url += this._apiAddress;
			url += option.isRemoveServicePath ? '' : 'service/';
			url += option.uriPath;
			url += option.querystring ? Util.Restful.jsonToQueryString(option.querystring) : '';
		return url;
	}

    /**
     * Set Auth Token
     */
    private _createOptions(params: any, header: any, method: RequestMethod) {
        let sessionStore = InjectorUtil.getService(SessionStore);
        let accessToken: string = '';
        if (sessionStore && sessionStore.getToken()) {
            accessToken = sessionStore.getToken().access_token;
        }

        let headers = new Headers(
            Object.assign(
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'bearer ' + accessToken
                },
                header
            )
        );

        if (method === RequestMethod.Get) {
            if(params) {
                return {
                    body: '',
                    options: new RequestOptions({
                        body: '',
                        search: params,
                        method,
                        headers
                    })
                };
            } else {
                return {
                    body: '',
                    options: new RequestOptions({
                        body: '',
                        method,
                        headers
                    })
                };
            }
        }
        else if (method === RequestMethod.Delete) {
            let body ='';
            if(typeof(params)=="object"){
                body = JSON.stringify(params);
            }else if(params!=undefined){
                body = params;
            }
            return {
                body: '',
                options: new RequestOptions({
                    body: body,
                    method,
                    headers
                })
            };
        }
        else {
            return {
                body: JSON.stringify(params),
                options: new RequestOptions({
                    method,
                    headers
                })
            };
        }
    }

	/**
	 * toJson for response data
	 */
	private _toJson(response: any): any {
		if (response && response._body && response._body.length > 0) {
		    return response.json();
        }
		return {};
	}

    /**
     * error
     */
    private _handleError(error: any) {
        let errMsg: any = {
            url: error.url,
            status: error.status,
            statusText: error.statusText,
            message: error._body
        };
        // console.error('>> AJAX error', errMsg);
        return Observable.throw(errMsg);
    }
}
