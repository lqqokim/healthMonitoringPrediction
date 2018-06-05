/**
 * When routing enter into path, let's check out authorization. If not valid, go login
 */
import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';

import { SessionStore } from '../../sdk';
import { StateManager, CurrentAction, WorkspaceAction, SessionService } from '../../common';

import { RouterService } from '../router/router.service';
import { WorkspaceService } from './workspace.service';

@Injectable()
export class WorkspacesGuard implements CanActivate {

    constructor(
        private sessionService: SessionService,
        private sessionStore: SessionStore,
        private router: RouterService,
        private stateManager: StateManager,
        private currentAction: CurrentAction,
        private workspaceAction: WorkspaceAction,
        private workspace: WorkspaceService
    ) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('>> WorkspacesGuard check');
        console.log('>> state.url', state.url);

        let workspaceId: number;
        let taskerId: number;
        try {
            const tmp = state.url.substring(1).split('/');
            if (tmp && tmp.length === 4) {
                workspaceId = parseInt(tmp[1], 10);
                taskerId = parseInt(tmp[3], 10);

                this.currentAction.setWorkspace(workspaceId, taskerId);
            }
        } catch (e) {
            console.error('Workspaces Guard exception', e);
        }

        if (!this.sessionStore || !this.sessionStore.isSignin()) {
            this.router.goLogin();
            return false;
        }
        
        // session vaid check
        this.sessionService.get()
            .subscribe((response: any) => {
                if (this.sessionStore && this.sessionStore.isSignin()) {
                    this._setWorkspaces(workspaceId, taskerId);
                }
            }, (error: any) => {
                this.router.goLogin();
                console.error('session check error', error);
            });

        return true;
    }

    private _setWorkspaces(workspaceId: number, taskerId: number) {
        if (this.stateManager.getWorkspaces().length === 0) {
            this.workspace.getWorkspaces('?onlyMyWorkspaces=false')
                .then((workspaces: any) => {
                    if (workspaces && workspaces.length > 0) {
                        this.workspaceAction.setWorkspaces(workspaces);
                    }
                }, (err) => {
                    console.log('get workspaces exception: ', err);
                });
        }
    }
}