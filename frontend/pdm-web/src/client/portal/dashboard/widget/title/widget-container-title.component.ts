import { Component } from '@angular/core';
import { DashboardAction, ValidationService } from '../../../../common';
import { DashboardsService } from '../../dashboards.service';
import { WidgetTitleComponent } from './widget-title.component';

@Component({
    moduleId: module.id,
    selector: 'a3p-widget-container-title',
    template: `
       <div class="widget-set a3-widget-title">
           <div class="a3-widget-name" *ngIf="!widgetTitle.isEdit" (click)="setClick($event)">
               {{ widgetTitle.title }}<i class="fa fa-pencil-square-o input-name"></i>
           </div>
           <!-- 클릭후 인풋박스 전환-->
           <div class="a3-widget-name a3-widget-edit-name" *ngIf="widgetTitle.isEdit">
               <input type="text" #title
                      class="form-control"
                      placeholder="{{ widgetTitle.title }}"
                      (keydown.enter)="setWidgetTitle($event)"
                      (blur)="setWidgetTitle($event)"
                      [(ngModel)]="widgetTitle.title"
                      kr-input
                      focus-me>
           </div>
       </div>
    `
})
export class WidgetContaierTitleComponent extends WidgetTitleComponent {
    constructor(
        dashboardAction: DashboardAction,
        dashboards: DashboardsService,
        validationService: ValidationService
    ) {
        super(dashboardAction, dashboards, validationService);
    }
}



