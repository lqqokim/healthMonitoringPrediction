import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CommunicationAction, StateManager, PageModel, PageAction } from '../../../common';

@Component({
    selector: '[a3p-widget-list-content]',
    template: `
        <ul class="container-group" (click)="addWidget()">
            <li class="user-image">
                <img src="assets/images/widgets/{{ widgetType?.name | a3CamelToDashed }}.png" class="app-list-image" />
            </li>
            <li class="contents app-list">
                <ul>
                    <li class="chart-name">{{ widgetType?.title }}</li>
                    <li class="content">{{ widgetType?.description | a3DescToDashed }}</li>
                </ul>
            </li>
        </ul>
    `
})
export class WidgetListContentComponent implements OnInit, OnDestroy {

    @Input() widgetType: any;
    isAddingWidget: boolean = false;
    private _pageSubscription: Subscription;

    constructor(
        private _communicationAction: CommunicationAction,
        private _pageAction: PageAction,
        private stateManager: StateManager
    ) {}

    ngOnInit() {
        const page$ = this.stateManager.rxPage();
        this._pageSubscription = page$.subscribe((pageModel: PageModel) => {
            if (pageModel.originalActionType === ActionType.ADD_WIDGET) {
                this.isAddingWidget = false;
            }
        });
    }

    addWidget() {
        if (!this.isAddingWidget) {
            this.isAddingWidget = true;
            this._pageAction.checkPage(ActionType.ADDING_WIDGET);
            this._communicationAction.addWidget(this.widgetType);
        }
    }

    ngOnDestroy() {
        if (this._pageSubscription) {
            this._pageSubscription.unsubscribe();
        }
    }
}
