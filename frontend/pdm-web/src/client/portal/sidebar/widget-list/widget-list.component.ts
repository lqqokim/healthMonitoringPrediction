import { Component, OnInit, OnDestroy } from '@angular/core';

import { WidgetListService} from './widget-list.service';
import { SidebarService } from '../sidebar.service';
import { Subscription } from 'rxjs/Subscription';
import { StateManager, PageModel } from '../../../common';

@Component({
    moduleId: module.id,
    selector: '[a3p-sidebar-panel][a3p-widget-list]',
    template: `
        <div [ngClass]="{'disabled': isAddingWidget === true}">
            <div a3p-widget-list-content [widgetType]="widgetType" *ngFor="let widgetType of widgetTypes"></div>
        </div>
    `,
    providers: [WidgetListService]
})
export class WidgetListComponent implements OnInit, OnDestroy {

    widgetTypes: any;
    isAddingWidget: boolean = false;
    private _pageSubscription: Subscription;

    constructor(
        private widgetList: WidgetListService,
        private sidebar: SidebarService,
        private stateManager: StateManager
    ) {}

    ngOnInit() {
        // TODO 
        // sidebarContainer.showSpinner();

        const page$ = this.stateManager.rxPage();
        this._pageSubscription = page$.subscribe((pageModel: PageModel) => {
            if (pageModel.originalActionType === ActionType.ADD_WIDGET) {
                this.isAddingWidget = false;
            } else if (pageModel.originalActionType === ActionType.ADDING_WIDGET) {
                this.isAddingWidget = true;
            }
        });

        this.widgetList
            .getList()
            .then((response: any) => {
                this.widgetTypes = response;
                this.sidebar.hideSpinner();
            }, (error: any) => {
                this.sidebar.showError();
                console.log('widget list exception: ', error);
            });
    }

    ngOnDestroy() {
        if (this._pageSubscription) {
            this._pageSubscription.unsubscribe();
        }
    }
}
