import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { 
    StateManager, 
    WorkspaceAction, 
    CurrentAction,
    CurrentModel
} from '../../common';
import { WorkspaceService } from './workspace.service';

@Component({
    moduleId: module.id,
    selector: 'div.a3-wrapper[a3p-workspaces-root]',
    host: {
        'style': 'height: 100%'
    },
    templateUrl: 'workspaces-root.html'
})
export class WorkspacesRootComponent implements OnInit, OnDestroy {

    @HostBinding('class.a3-workspace') isWorkspace: boolean;
    private _currentSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private stateManager: StateManager,
        private currentAction: CurrentAction,
        private workspaceAction: WorkspaceAction,
        private workspace: WorkspaceService
    ) {}

    ngOnInit() {
        // console.log('----WorkspacesRootComponent init');
        this._setState();
    }

    _setState() {
        // current 
        const current$ = this.stateManager.rxCurrent();
        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            if (current.homeType === ActionType.DASHBOARD) {
                this.isWorkspace = false;
                this.ngOnDestroy();
            }

            if (current.homeType === ActionType.WORKSPACE) {
                this.isWorkspace = true;
            }
        }, this._handleError);
    }

    _handleError(e: any) {
        console.log('Workspace Root Component, Exception', e);
    }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
    }
}