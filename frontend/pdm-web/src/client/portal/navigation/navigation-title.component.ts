import { 
    Component, 
    Input, 
    OnChanges,
    SimpleChanges
} from '@angular/core';

import { Util, Translater } from '../../sdk';
import {
    StateManager,
    DashboardAction,
    SidebarAction,
    FilterAction,
    ValidationService
} from '../../common';
import { DashboardsService } from '../dashboard/dashboards.service';
import { WorkspaceService } from '../workspace/workspace.service';

/**
 * Define navigation title model
 */
export interface NavigationTitle {
    isEdit: boolean;
    current?: any;
    id?: number;
    title?: string;
    beforeTitle?: string;
    isHome?: boolean;
}

@Component({
    moduleId: module.id,
    selector: 'a3p-navigation-title',
    templateUrl: 'navigation-title.html'
})
export class NavigationTitleComponent implements OnChanges {

    // ($timeout, dashboards, workspace, dashboardAction, stateManager, unicoder, deeper)
    @Input() main: any;
    navigationTitle: NavigationTitle = {
        isEdit: false
    };
    @Input() isShared: boolean;
    sharedTitle: string;
    @Input() shareUser: string;

    constructor(
        private stateManager: StateManager,
        private dashboardAction: DashboardAction,
        private dashboards: DashboardsService,
        private workspace: WorkspaceService,
        private sidebarAction: SidebarAction,
        private filterAction: FilterAction,
        private translater: Translater,
        private validationService: ValidationService
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['main'] && changes['main'].currentValue) {
            const main = changes['main'].currentValue;
            this.navigationTitle.current = this.stateManager.getCurrent();
            this.navigationTitle.id = this.navigationTitle.current.isDashboard() ? '' : this.navigationTitle.current.workspaceId;
            this.navigationTitle.title = this.main.title;
            this.navigationTitle.beforeTitle = this.main.title;
            this.navigationTitle.isHome = this.main.home;
        }

        if (changes['shareUser'] && changes['shareUser'].currentValue) {
            const shareUser = changes['shareUser'].currentValue;
            this.translater.get('MESSAGE.GENERAL.SHARE_USER', {user: shareUser}).subscribe((msg) => {
                this.sharedTitle = msg;
            });
        }
    }

    setClickDashboardTitle(e: any) {
        e.stopPropagation();

        // they should be must closed
        this.sidebarAction.close();
        this.filterAction.close();

        // set home dashboard
        var current = this.stateManager.getCurrent();
        if (current.isDashboard() && !this.navigationTitle.isHome && e && e.offsetX <= 18) {
            this.setHomeDashboard(e);
            return;
        }

        // If it is shared, not modify title of dashboard or workspace 
        if (this.isShared) {
            return;
        }

        if (this.navigationTitle.isEdit) {
            return;
        }

        this.navigationTitle.beforeTitle = this.navigationTitle.title;
        this.navigationTitle.isEdit = true;
    }

    setDashboardTitle(e: any) {
        e.stopPropagation();

        if (e.type === 'blur') {
            this._updateTitle();
        } else {
            if (e.keyCode === 13) { // enter
                jQuery('#navigation-title').trigger('blur');
            } else if (e.keyCode === 27) { // escape
                this.navigationTitle.isEdit = false;
            }
        }
    }

    setHomeDashboard(event: any) {
        var dashboard = this.stateManager.getDashboard();
        this.dashboards
            .updateHomeDashboard(dashboard.dashboardId)
            .then((response: any) => {
                // direct settings
                this.navigationTitle.isHome = true;
                // set home dashboard dispatch
                this.dashboardAction.setHomeDashboard(dashboard.dashboardId);
            }, (error: any) => {
                console.log('update home dashboard exception: ', error);
            });
    }

    private _updateTitle() {
        const current = this.stateManager.getCurrent();
        // if title delete all, set 'My Dashboard' or 'My Workspace'
        if (!this.navigationTitle.title
            || this.navigationTitle.title === ''
            || this.validationService.isWhitespaceInValid(this.navigationTitle.title)) {
            // if (current.isDashboard()) {
            //     this.navigationTitle.title = 'My Dashboard';
            // } else {
            //     this.navigationTitle.title = 'My Workspace';
            // }
            this.navigationTitle.title = this.navigationTitle.beforeTitle;
        }

        if (this.navigationTitle.title === this.navigationTitle.beforeTitle) {
            this.navigationTitle.title = this.navigationTitle.beforeTitle;
            this.navigationTitle.isEdit = false;
        } else {
            if (current.isDashboard()) {
                let dashboard = this.stateManager.getDashboard();
                let updateDashboard = Object.assign({}, dashboard);
                updateDashboard.title = this.validationService.trimWhitespace(Util.Unicode.unicode_substring(this.navigationTitle.title, 50));

                this.dashboards
                    .updateDashboard(updateDashboard)
                    .then((response: any) => {
                        dashboard.title = updateDashboard.title;
                        this.navigationTitle.title = updateDashboard.title;
                        this.navigationTitle.isEdit = false;
                        this._changeBrowserTabTitle(updateDashboard.title);
                    }, (error: any) => {
                        this.navigationTitle.title = dashboard.title;
                        this.navigationTitle.isEdit = false;
                        console.log('changing dashboard title exception: ', error);
                    });
            } else {
                let ws = this.stateManager.getWorkspace();
                let updateWorkspace = Object.assign({}, ws);
                updateWorkspace.title = Util.Unicode.unicode_substring(this.navigationTitle.title, 50);

                this.workspace
                    .updateWorkspace(updateWorkspace)
                    .then((response: any) => {
                        ws.title = this.navigationTitle.title;
                        this.navigationTitle.isEdit = false;
                        this._changeBrowserTabTitle(this.navigationTitle.title);
                    }, (error: any) => {
                        this.navigationTitle.title = ws.title;
                        this.navigationTitle.isEdit = false;
                        console.log('changing workspace title exception: ', error);
                    });
            }
        }
    }

    private _changeBrowserTabTitle(title: string) {
        jQuery(document).attr({
            title: title
        });
    }

}

