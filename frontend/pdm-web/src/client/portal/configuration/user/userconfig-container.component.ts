import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateManager, CurrentModel, ConfigurationAction, SessionService } from '../../../common';

import { ConfigurationMenuService } from '../configuration-menu.service'; 

@Component({
    moduleId: module.id,
    selector: 'div.a3p-user-configuration',
    templateUrl: 'userconfig-container.html'
})
export class UserConfigContainerComponent implements OnInit, OnDestroy {

    applications: any[];
    selectedApplication: any;
    selectedMenu: any;
    viewMenu: boolean = true;
    isActive: boolean = false;
    userName: string;
    private _configurationSubscription: Subscription;    

    constructor(
        private stateManager: StateManager,
        private configruationAction: ConfigurationAction,
        private configurationMenu: ConfigurationMenuService,
        private session: SessionService
    ) {}

    ngOnInit() { 
        this._init();
    }

    private _init() {
        this.userName = this.session.getUserId();
        this.configurationMenu.getUser()
            .then((applications: any) => {
                this.applications = applications;
                this._setState();
            }, (err: any) => {
                console.log('get user configuration  exception: ', err);
            });
    }

    private _setState() {
        const configuration$ = this.stateManager.rxCurrent();
        this._configurationSubscription = configuration$.subscribe((currentModel: CurrentModel) => {
            if (currentModel.actionType.indexOf('_MODAL') > 0) {
                return;
            }

            if (currentModel.actionType !== ActionType.USERCONFIG) {
                this.isActive = false;
                return;
            }
            if (!this.isActive) {
                this.isActive = true;
            }
            this._findMenu(currentModel.applicationId, currentModel.menuId);
        });
    }

     private _findMenu(applicationId: any, menuId: any) {
        if (!this.applications || this.applications.length === 0) {
            return;
        } 

        const apps = this.applications.filter((application: any) => {
            if (application.applicationId === applicationId) { return application; }
        });

        if (apps.length >= 1) {
            this.selectedApplication = apps[0];
        }

        const menu = this.selectedApplication.menus.filter((menu: any) => {
            if (menu.menuId === menuId) { return menu; }
        });

        if (menu.length >= 1) {
            this.selectedMenu = menu[0];
        }

        // set menuId to create menu view 
        this.selectedApplication = {
            applicationId: this.selectedApplication.applicationId,
            selectedMenuId: this.selectedMenu.menuId
        };
    }

    goMenu(applicationId, menuId) {
        this.configruationAction.openUser(applicationId, menuId);
    }

    showMenu(flag: boolean) {
        this.viewMenu = flag;
    }

    closeConfiguration() {
        this.isActive = false;
    }

    ngOnDestroy() {
        if (this._configurationSubscription) {
            this._configurationSubscription.unsubscribe();
        }
    }

}