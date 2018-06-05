import { Component, OnChanges, SimpleChanges, Input, ElementRef, ViewChild } from '@angular/core';

import { DashboardAction, ValidationService } from '../../../../common';
import { Util } from '../../../../sdk';

import { DashboardsService } from '../../dashboards.service';

export interface WidgetTitle {
    isEdit: boolean;
    dashboardId?: number;
    title?: string;
    beforeTitle?: string;
}

@Component({
    moduleId: module.id,
    selector: 'a3p-widget-title',
    template: ``
})
export class WidgetTitleComponent implements OnChanges {
    @ViewChild('title') titleRef: ElementRef;
    @Input() main: any;
    // titleRef: ElementRef;
    widgetTitle: WidgetTitle = {
        isEdit: false
    };
    private _widgetModel: any;

    constructor(
        private dashboardAction: DashboardAction,
        private dashboards: DashboardsService,
        private validationService: ValidationService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        const main = changes['main'].currentValue;
        if (main) {
            this.widgetTitle.title = this.main.title;
            this.widgetTitle.beforeTitle = this.main.title;
            this._widgetModel = main;
        }
    }

    setClick(e: any) {
        e.stopPropagation();

        if (this.widgetTitle.isEdit) {
            return;
        }

        this.widgetTitle.beforeTitle = this.widgetTitle.title;
        this._fireEvent(true);
    }

    setWidgetTitle(e: any) {
        e.stopPropagation();

        if (!this.widgetTitle.isEdit) {
            return;
        }

        if (e.type === 'blur') {
            this._updateTitle();
        } else {
            if (e.keyCode === 13) { // enter
                jQuery(this.titleRef.nativeElement).trigger('blur');
                // jQuery('#widget-title').trigger('blur');
            } else if (e.keyCode === 27) { // escape
                this._fireEvent(false);
            }
        }
    }

    private _updateTitle() {
        if (!this.widgetTitle.title
            || this.widgetTitle.title === ''
            || this.widgetTitle.title === this.widgetTitle.beforeTitle
            || this.validationService.isWhitespaceInValid(this.widgetTitle.title)) {
            this.widgetTitle.title = this.widgetTitle.beforeTitle;
            this._fireEvent(false);
        } else {
            this._widgetModel.title = this.validationService.trimWhitespace(Util.Unicode.unicode_substring(this.widgetTitle.title, 50));

            this.dashboards
                .updateWidget(this._widgetModel.dashboardId, this._widgetModel)
                .then((widgetModel: any) => {
                    this._fireEvent(false);
                    // change widget title in dashboard
                    this.dashboardAction.updateWidgetTitle(widgetModel);
                }, (error: any) => {
                    this.widgetTitle.title = this.widgetTitle.beforeTitle;
                    this._fireEvent(false);
                    console.log('changing widget title exception: ', error);
                });
        }
    }

    private _fireEvent(isCurrentEdit: boolean) {
        setTimeout(() => {
            this.widgetTitle.isEdit = isCurrentEdit;
        });
    }
}
