import { Component, Input } from '@angular/core';

import { 
    StateManager, 
    ConditionService,
    SidebarAction, 
    WorkspaceAction
} from '../../../common';
import { RouterService } from '../../router/router.service';
import { WorkspaceService } from '../../workspace/workspace.service';

@Component({
    moduleId: module.id,
    selector: 'div[a3p-tasker-list-content]',
    template: `
        <div class="a3-sidebar-category">
            <h5 class="a3-sidebar-category-title">{{ category.name }}</h5>
            <div *ngFor="let tasker of category.taskerList">
                <ul class="container-group" (click)="goTaskerEvent(tasker.taskerTypeId)">
                    <li class="user-image"><img src="assets/images/apps/{{ tasker.name | a3CamelToDashed }}.png" class="app-list-image" /></li>
                    <li class="contents app-list">
                        <ul>
                            <li class="chart-name">{{ tasker.title }}</li>
                            <li class="content">{{ tasker.description | a3DescToDashed }}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class TaskerListContentComponent {

    @Input() category: any;
    private newWindow: any;

    constructor(
        private condition: ConditionService,
        private stateManager: StateManager,
        private sidebarAction: SidebarAction,
        private workspaceAction: WorkspaceAction,
        private workspace: WorkspaceService,
        private router: RouterService
    ) {}

    goTaskerEvent(taskerTypeId: number) {
        let current = this.stateManager.getCurrent(),
            params = {}, promise: any;

        this.sidebarAction.close();

        this.newWindow = window.open('', '_blank');
        $(this.newWindow).one('close', this._disposeWindow);

        if (current.isDashboard()) {
            if (this.stateManager.getWorkspaces().length === 0) {
                promise = this.workspace
                    .getWorkspaces()
                    .then((workspaces) => {
                        this.workspaceAction.setWorkspaces(workspaces);
                        return this._createWorkspace(taskerTypeId);
                    }, (err) => {
                        console.log('get workspaces exception: ', err);
                    });
            } else {
                promise = this._createWorkspace(taskerTypeId);
            }
        } else {
            promise = this._createTasker(current.workspaceId, taskerTypeId, current.taskerId);
        }

        // TODO exception at first
        promise['catch'](this._closeWindow);
        if (promise['finally']) {
            promise['finally'](this._disposeWindow);
        }

        return promise;
    }

    private _disposeWindow() {
        this.newWindow = null;
    }

    private _closeWindow(reason: any) {
        if (this.newWindow != null && !this.newWindow.closed) {
            if (reason) {
                console.warn('Error is occured from API for creating workspace', reason);
            }
            this.newWindow.close();
        }
        this._disposeWindow();
    }

    private _createWorkspace(taskerTypeId: number) {
        return this.workspace
            .createWorkspace()
            .then((newWorkspace: any) => {
                this.workspaceAction.addWorkspace(newWorkspace);
                return this._createTasker(newWorkspace.workspaceId, taskerTypeId, null);
            }, (err) => {
                console.log('Error while create a new workspace: ', err);
            });
    }

    private _createTasker(workspaceId: number, taskerTypeId: number, parentId: number) {
        return this.workspace
            .createTasker(workspaceId, taskerTypeId, parentId)
            .then((tasker: any) => {
                // 1. set tasker into action
                if (parentId) {
                    this.workspaceAction.addTasker(tasker);
                } else {
                    this.workspaceAction.setTaskers(tasker.workspaceId, [tasker]);
                }

                // 2. create drill down info
                // category
                //   - categoryType: 'widget', 'tasker'
                //   - categoryId: number
                let drillDownInfos: any;
                if (this.category.type === 'widget') {
                    drillDownInfos = this.condition.makeWidgetConditions(
                        this.category.id, 
                        this.category.properties,
                        this.category.syncOutCondition
                    );
                } else if (this.category.type === 'tasker') {
                    drillDownInfos = this.condition.makeTaskerConditions(
                        workspaceId, 
                        this.category.id, 
                        this.category.syncOutCondition
                    );
                }

                return this.condition
                    .create(tasker.workspaceId, tasker.taskerId, drillDownInfos)
                    .then((response: any) => {
                        // 4. routing to tasker
                        this.router.goWorkspace(tasker.workspaceId, tasker.taskerId, this.newWindow);
                    });

            }, (err) => {
                console.log('Error while create a new tasker: ', err);
                this._disposeWindow();
            });
    }

}