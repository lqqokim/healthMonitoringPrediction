import { Injectable } from '@angular/core';
import { StateManager } from '../../common';
import { WorkspaceModelService } from "../../common/model/platform/workspace-model.service";

@Injectable()
export class WorkspaceService {

    constructor(
        private model: WorkspaceModelService,
        private stateManager: StateManager
    ) {}

    createWorkspace() {
        let requests: any = {
            workspaceId: (<any>undefined),
            title: 'My Workspace',
            description: '',
            favorite: false
        };
        return this.model.createWorkspace(requests);
    }

    getWorkspaces(filter: any = '') {
        return this.model.getWorkspaces(filter);
    }

    getWorkspace(workspaceId: number) {
        return this.model.getWorkspace(workspaceId);
    }

    updateWorkspace(workspace: any) {
        let params = {
            workspaceId: workspace.workspaceId,
            title: workspace.title,
            favorite: workspace.favorite,
            description: workspace.description ? workspace.description : '' 
        };

        return this.model.updateWorkspace(workspace.workspaceId, params);
    }

    deleteWorkspace(workspaceId: number) {
        return this.model.deleteWorkspace(workspaceId);
    }

    createTasker(workspaceId: any, taskerTypeId: any, parentId: any) {
        //TODO: backend should set a title as string if it is null
        let taskerType = this.stateManager.getTaskerType(taskerTypeId);
        if (!taskerType) {
            return this.model.getTaskerTypes().then((taskerTypes: any) => {
                taskerType = _.find(taskerTypes, { taskerTypeId: taskerTypeId });
                return this._createTasker(workspaceId, taskerTypeId, parentId, taskerType);
            });
        } else {
            return this._createTasker(workspaceId, taskerTypeId, parentId, taskerType);
        }

    }

    private _createTasker(workspaceId: any, taskerTypeId: any, parentId: any, taskerType: any) {
        let params = {
            taskerId: (<any>undefined),
            title: taskerType ? taskerType.title : 'Tasker Title',
            parentId: parentId === undefined ? null : parentId,
            taskerTypeId: taskerTypeId
        };

        return this.model.createTasker(workspaceId, params);
    }

    getTaskers(workspaceId: any) {
        return this.model.getTaskers(workspaceId);
    }

    deleteTasker(workspaceId: any, taskerId: any) {
        return this.model.deleteTasker(workspaceId, taskerId);
    }
}

