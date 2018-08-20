import { Component, OnInit, OnDestroy, HostBinding, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateManager, CurrentModel, ConfigurationAction } from '../../../common';

import { ConfigurationMenuService } from '../configuration-menu.service'; 

@Component({
    moduleId: module.id,
    selector: 'div.a3p-global-configuration',
    templateUrl: 'globalconfig-container.html'
})
export class GlobalConfigContainerComponent implements OnInit, OnDestroy {

    applications: any[];
    selectedApplication: any;
    selectedMenu: any;
    viewMenu: boolean = true;
    isActive: boolean = false;
    private _configurationSubscription: Subscription;    

    constructor(
        private stateManager: StateManager,
        private configruationAction: ConfigurationAction,
        private configurationMenu: ConfigurationMenuService
    ) {}

    ngOnInit() {
        this._init();
    }

    private _init() {
        this.configurationMenu.getPdmGlobals()
            .then((applications: any) => {
                console.log('getPdmGlobals applications', applications);
                this.applications = applications;
                this._setState();
            }, (err: any) => {
                console.log('get global configuration  exception: ', err);
            });
    }

    private _setState() {
        const configuration$ = this.stateManager.rxCurrent();
        this._configurationSubscription = configuration$.subscribe((currentModel: CurrentModel) => {
            if (currentModel.actionType.indexOf('_MODAL') > 0) {
                return;
            }

            if (currentModel.actionType !== ActionType.GLOBALCONFIG) {
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

        console.log('apps', apps);

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
        this.configruationAction.openGlobal(applicationId, menuId);
    }

    showMenu(flag: boolean) {
        this.viewMenu = flag;
    }

    isShow(application: any) {
        if (!this.selectedApplication) {
            return false;
        } else {
            // return application.applicationId === this.selectedApplication.applicationId;
            return true;
        }
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