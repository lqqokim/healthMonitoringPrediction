import { Injectable } from '@angular/core';
import { SessionStore, RestfulModelService } from '../../sdk';
import { PlatformModelService } from '../model/platform/platform-model.service';
import { Observable } from 'rxjs/Observable';

/**
 * Auth Token key
 */
const CLIENT_KEY: string = 'YWN1YmVkLXRydXN0ZWQtZnJvbnRlbmQ6YmlzdGVsMDE=';

/**
 * TODO: temporary access user list
 */
const adminGroupId = 'ADMIN_GROUP';
let allowUserId = [];

@Injectable()
export class SessionService {

    authorities:any = {};

    constructor(
        private sessionStore: SessionStore,
        private model: PlatformModelService,
		private restful: RestfulModelService
	) {
    }

    get(): Observable<any> {
        return this.getAllowUser()
            .switchMap((response: any) => {
                return this.model.getSession();
            });
    }

    getAllowUser(): Observable<any> {
        return this.model.getRxGroupUsers(adminGroupId).map((response: any) => {
                console.log('getAllowUser : ', adminGroupId, response);
                allowUserId = _.pluck(response,'userId');
        });
    }

    /*
    login(userInfo: any) {
        let params = {
                        grant_type: 'password',
                        username: userInfo.userId,
                        password: userInfo.password
                     };
        let querystring = this.utils.jsonToQueryString(params);
        let header = {
                        'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                        'Authorization': 'Basic '+ CLIENT_KEY
                     };

        return this.model.getAuth()
                   .rxPOST(params, 'token', querystring, header, true)
                   .switchMap((response: any) => {
                        this.sessionStore.setToken(response);
                        return this.get();
                   });
    }
    */

	login(userInfo: any) {
		let querystring = {
			grant_type: 'password',
			username: userInfo.userId,
			password: userInfo.password
		};
		// let querystring = this.utils.jsonToQueryString(params);
		let header = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Authorization': 'Basic '+ CLIENT_KEY
		};

		return this.restful.rxPOST({
			uriPath: `oauth/token`,
			params: {},
			header,
			querystring,
			isRemoveServicePath: true
		}).switchMap((response: any) => {
			this.sessionStore.setToken(response);
			return this.get();
		});

        /******************** */
        /* New Authority code */
        /******************** */
		// tslint:disable-next-line:max-line-length
		// let body =  "grant_type=password&client_id=acubed-trusted-frontend&scope=openid&username="+userInfo.userId+"&password="+userInfo.password;
        // return this.restful.rxPOSTLogin('http://localhost:8082/portal/oauth/token',body,header).switchMap((response: any) => {
		// 	this.sessionStore.setToken(response);
		// 	return this.getAuthority();
		// });

	}

    logout() {
        return this.model.deleteSession();
        // return this.model.getSession().doDELETE('');
    }

    isSignin() {
        return this.sessionStore.isSignin();
    }

    getUserInfo() {
        // userinfo object
        // 'userId', 'name', 'userImgPath' properties
        return this.sessionStore.getSignInfo();
    }

    getUserId() {
        return this.sessionStore.getSignInfo()['userId'];
    }

    getUserName() {
        return this.sessionStore.getSignInfo()['name'];
    }

    getUserImgPath() {
        return this.sessionStore.getSignInfo()['userImgPath'];
    }

    isAdmin() {
        if (!this.sessionStore.getSignInfo()) return false;
        return allowUserId.indexOf(this.sessionStore.getSignInfo()['userId']) > -1;
    }

    /******************** */
    /* New Authority code */
    /******************** */

    getAuthority() {
        let authorities = this.model.getAuthority();
        this.setAuthority(authorities);
        return authorities;
    }

    setAuthority(param_authorities :any) {
        for(let i = 0; i < param_authorities.length; i++) {
            const datas = param_authorities[i].split(':'); //condition:function:permission
            if(this.authorities[datas[0]] === undefined) this.authorities[datas[0]] = {};
            const key = datas[1] + ':' + datas[2];
            this.authorities[datas[0]][key] = true;
        }
    }

    resetAuthority() {
        this.authorities = {};
    }

    hasPermission(menu:string,functionName:string,action:string) {
        let allCondition = this.authorities['ALL'];
        if(allCondition === undefined) return false;

        if(allCondition['ALL:FUNCTION_ALL'] !== undefined) return true;

        if(allCondition[menu+':FUNCTION_ALL'] !== undefined) {
            if(allCondition[menu+':ACTION_ALL'] !== undefined) return true;
            if(allCondition[menu+':'+action] !== undefined) return true;
        }

        if(allCondition[functionName+':FUNCTION_ALL'] !== undefined) return true;

        if(allCondition[functionName+':ACTION_ALL'] !== undefined) return true;

        if(allCondition[functionName+':'+action] !== undefined) return true;

        return false;
    }

}
