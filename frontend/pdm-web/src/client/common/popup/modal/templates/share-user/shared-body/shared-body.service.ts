import { Injectable } from "@angular/core";
import { PlatformModelService } from "../../../../../model/platform/platform-model.service";
import { WorkspaceModelService } from "../../../../../model/platform/workspace-model.service";
import { DashboardModelService } from "../../../../../model/platform/dashboard-model.service";

@Injectable()
export class SharedBodyService {

    constructor(
        private platformModel: PlatformModelService,
        private workspaceModel: WorkspaceModelService,
        private dashboardModel: DashboardModelService
    ) {}

    getMembers() {
        let p = [this.platformModel.getUsers(), this.platformModel.getGroups()];
        let merge: any = [];
        let result: any = [];
        return Promise.all(p).then((data: any) => {
            data.forEach((d) => {
                merge = merge.concat(d);
            });
            merge.forEach((d) => {
                result.push({
                    groupId: d.groupId,
                    id: d.userId ? d.userId : d.groupId,
                    name: d.userId ? d.name : d.description,
                    alias: d.userId ? d.name : '#'+d.groupId,
                    type: d.userId ? 'user' : 'group'
                });
            })
            return Promise.resolve(result);
        }, (error: any) => {
            throw error;
        });
    }

    saveMembers(params: any, request: any) {
        if (params.type === A3_CONFIG.MODAL.TYPE.SHARE_WORKSPACE)
            return this.workspaceModel.updateWorkspacesSharemembers(params.id, request);
        else
            return this.dashboardModel.updateDashboardsSharemembers(params.id, request);
    }

    deleteMembers(params: any, request: any) {
        if (params.type === A3_CONFIG.MODAL.TYPE.SHARE_WORKSPACE)
            return this.workspaceModel.deleteWorkspacesSharemembers(params.id, request);
        else
            return this.dashboardModel.deleteDashboardsSharemembers(params.id, request);
    }
}
