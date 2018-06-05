import { Component } from '@angular/core';
import { DashboardAction, ValidationService } from '../../../../common';
import { DashboardsService } from '../../dashboards.service';
import { WidgetTitleComponent } from './widget-title.component';

@Component({
    moduleId: module.id,
    selector: 'a3p-widget-configuration-title',
    template: `
        <span class="a3-sub-title-edit-wrapper">
            <div *ngIf="!widgetTitle.isEdit" class="a3-subbar-title" (click)="setClick($event)">
                {{ widgetTitle.title }}<i class="fa fa-pencil-square-o input-text"></i>
            </div>
            <input #title
                   *ngIf="widgetTitle.isEdit"
                   (keydown.enter)="setWidgetTitle($event)"
                   (blur)="setWidgetTitle($event)"
                   [(ngModel)]="widgetTitle.title"
                   kr-input
                   focus-me
                   type="text"
                   class="a3-subbar-title a3-subbar-edit-title form-control"
                   placeholder="{{ widgetTitle.title }}">
        </span>
    `
})
export class WidgetConfigurationTitleComponent extends WidgetTitleComponent {
    constructor(
        dashboardAction: DashboardAction,
        dashboards: DashboardsService,
        validationService: ValidationService
    ) {
        super(dashboardAction, dashboards, validationService);
    }
}
