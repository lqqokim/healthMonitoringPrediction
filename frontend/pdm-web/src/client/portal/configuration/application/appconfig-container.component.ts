import { Component, OnInit, OnDestroy, HostBinding, ViewChild, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StateManager, CurrentModel, ConfigurationAction } from '../../../common';

import { ConfigurationMenuService } from '../configuration-menu.service'; 

@Component({
    moduleId: module.id,
    selector: 'div.a3p-app-configuration',
    templateUrl: 'appconfig-container.html'
})
export class AppConfigContainerComponent implements OnInit, OnDestroy {

    applications: any[];
    selectedApplication: any;
    selectedMenu: any;
    viewMenu: boolean = true;
    isActive: boolean = false;
    private _configurationSubscription: Subscription;
    updateAppConfig: EventEmitter<any> = new EventEmitter();

    constructor(
        private stateManager: StateManager,
        private configruationAction: ConfigurationAction,
        private configurationMenu: ConfigurationMenuService
    ) {}

    ngOnInit() {
        this._init();
    }

    private _init() {
        this.configurationMenu.getApplications()
            .then((applications: any) => {
                this.applications = applications;
                this._setState();
            }, (err: any) => {
                console.log('get app configuration  exception: ', err);
            });
    }

    private _setState() {
        const configuration$ = this.stateManager.rxCurrent();
        this._configurationSubscription = configuration$.subscribe((currentModel: CurrentModel) => {
            if (currentModel.actionType.indexOf('_MODAL') > 0) {
                return;
            }

            if (currentModel.actionType !== ActionType.APPCONFIG) {
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

    goMenu(applicationId: any, menuId: any) {
        this.configruationAction.openApp(applicationId, menuId);
    }

    showMenu(flag: boolean) {
        this.viewMenu = flag;
    }

    closeConfiguration() {
        this.updateAppConfig.emit('close');
        this.isActive = false;
    }

    ngOnDestroy() {
        if (this._configurationSubscription) {
            this._configurationSubscription.unsubscribe();
        }
    }

}