import { Injectable } from "@angular/core";
import { PlatformModelService } from "../../../../../model/platform/platform-model.service";
import { WorkspaceModelService } from "../../../../../model/platform/workspace-model.service";
import { DashboardModelService } from "../../../../../model/platform/dashboard-model.service";

@Injectable()
export class SharedListService {

    constructor(
        private platformModel: PlatformModelService,
        private workspaceModel: WorkspaceModelService,
        private dashboardModel: DashboardModelService
    ) {}

    getSharedMembers(params: any) {
        // return this._mockGetSharedUser();
        if (params.type === A3_CONFIG.MODAL.TYPE.SHARE_WORKSPACE)
            return this.workspaceModel.getWorkspacesSharemembers(params.id);
        else
            return this.dashboardModel.getDashboardsSharemembers(params.id);
    }


    //
    // Mock Data
    //
    private _mockGetMembers(): Promise<any> {
        let result: any = [];
        for (let i=0; i<10; i++) {
            result.push({
                "userId": "id"+i,
                "name": "name"+i,
                "email": null,
                "phoneNo": null,
                "description": null,
                "department": null,
                "responsibilities": null
            })
        }
        return Promise.resolve(result);
    }
    private _mockGetSharedUser(): Promise<any> {
        let result: any = [];
        for (let i=0; i<6; i++) {
            result.push({
                "groupId": "group"+i,
                "userId": "id"+i,
                "name": "name"+i,
                "email": "email"+i+".bistel.com",
                "phoneNo": null,
                "description": null,
                "department": null,
                "responsibilities": null,
                "type": i % 2 === 0 ? 'group' : 'user'
            })
        }
        return Promise.resolve(result);
    }



    /*
     getModuleList( inlineTool: any ){
     return this.getModuleGroups( inlineTool ).then( ( res:any ) => {
     let groupData:any = res;
     let groupSvg: Array<any> = [];

     groupData.forEach( ( group: any ) => {
     groupSvg.push( this.getModulesInModuleGroup( inlineTool, group ));
     })

     return Promise.all( groupSvg ).then( ( data: any ) => {
     let moduleList: Array<any> = [];
     data.forEach( ( list: any ) => {
     list.forEach( ( module: any ) => {
     module = $.extend(true, module, { inlineTool : list.inlineTool, moduleGroup : list.moduleGroup });
     });
     moduleList = moduleList.concat(list);
     });
     return Promise.resolve(moduleList);
     })
     });
     }
     */
}
