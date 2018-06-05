import { Injectable } from '@angular/core';
import { ModelCommonService } from '../../model-common.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppModelService extends ModelCommonService {

    constructor() { super(); }

    getInlineGroups() {//inline group data list 가져오기
        return this.GET({
            uriPath: `mcc/inlinegroups`
        });
    }

    getInlineToolsByGroupId(inlineGroupId: number) {//inline group의 inline tool 정보 가져오기
        return this.GET({
            uriPath: `mcc/inlinegroups/${inlineGroupId}/inlinetools`
        });
    }

    getInlineTools() {//inline tool list infomation
        return this.GET({
            uriPath: `mcc/inlinetools`
        });
    }

    getInlineToolInfo(inlinetoolId: number) {//inline tool 의 설비 정보 가져오기
        return this.GET({
            uriPath: `mcc/inlinetools/${inlinetoolId}/tools`
        });
    }

    getToolsTrend(toolId: number) {
        return this.GET({
            uriPath: `mcc/tools/${toolId}`
        });
    }

    getModules(toolId: number) {
        return this.GET({
            uriPath: `mcc/tools/${toolId}/modules`
        });
    }

    getModule(toolId: number, moduleId: number) {
        return this.GET({
            uriPath: `mcc/tools/${toolId}/modules/${moduleId}`
        });
    }

    getToolAlarm(param: any) {
        return this.POST({
            uriPath: `toolalarm`,
            params: param
        });
    }

    getAppCodeCategories(appName: string, codeCategoryName: string): Observable<any> {
        return this.rxGET({
            uriPath: `apps/${appName}/codecategories/${codeCategoryName}/codes`,
        });
    }

    deleteAppCodeCategory(appName: string, codeCategoryName: string, code: string): Observable<any> {
        return this.rxDELETE({
            uriPath: `apps/${appName}/codecategories/${codeCategoryName}/codes/${code}`
        });
    }

    insertAppCodeCategory(appName: string, codeCategoryName: string, params: any): Observable<any> {
        return this.putAppCodeCategory(appName, codeCategoryName, params);
    }

    updateAppCodeCategory(appName: string, codeCategoryName: string, params: any): Observable<any> {
        return this.putAppCodeCategory(appName, codeCategoryName, params);
    }

    private putAppCodeCategory(appName: string, codeCategoryName: string, params: any): Observable<any> {
        //response : same request fill codeId..
        return this.rxPUT({
            uriPath: `apps/${appName}/codecategories/${codeCategoryName}/codes/`,
            params: params
        });
    }
}
