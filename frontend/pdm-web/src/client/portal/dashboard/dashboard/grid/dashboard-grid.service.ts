import {
    Injectable,
    ViewContainerRef,
    ComponentRef,
    ComponentFactoryResolver,
    ComponentFactory
} from '@angular/core';

import { WidgetContainerComponent } from '../../widget/widget-container.component';
import { DashboardGridConfigService } from './dashboard-grid-config.service';
import { StateManager, WidgetModel, SessionService } from '../../../../common';

@Injectable()
export class DashboardGridService {

    grider: any;
    private _isDashboardOwner: boolean;
    private _isPredefined: boolean;
    private _beforeWidgetComponents: any = [];

    constructor(
        private stateManager: StateManager,
        private compiler: ComponentFactoryResolver,
        private session: SessionService,
        private gridConfig: DashboardGridConfigService
    ) { }

    init(dashboard: any, container: ViewContainerRef) {
        // dashboard owner의 경우만 Widget의 resize 및 위치이동이 가능하다 
        this._isDashboardOwner =  dashboard.userId === this.session.getUserId();
        this._isPredefined = dashboard.predefined;

        if (this._isDashboardOwner && !this._isPredefined) {
            this.grider.resize_api.disabled = false;
            this.grider.drag_api.disabled = false;
        } else {
            this.grider.resize_api.disabled = true;
            this.grider.drag_api.disabled = true;
        }

        this._clearWidgets();
        this._addWidgets(dashboard.dashboardId, container);
    }

    createGrider(container: any) {
        this.grider = jQuery('.gridster-layout').gridster(this.gridConfig.config).data('gridster');
        return this.grider;
    }

    _clearWidgets() {
        // clear widgets
        if (this.grider) {
            this.grider.remove_all_widgets();
        }
        this._destroyWidgetsScope();
    }

    _addWidgets(dashboardId: any, container: ViewContainerRef) {
        let widgets = this.stateManager.getWidgets(dashboardId);
        _.each(widgets, (widget: WidgetModel, idx: number) => {
            // create widget 
            this.addWidget(dashboardId, widget, container, idx + 1, true, false).then((component) => {});
        });
    }

    /**
     * dynamic creation widget container component 
     */
    addWidget(dashboardId: any, widgetModel: WidgetModel, container: ViewContainerRef, idx: number, isNotFadeIn: any, isNewAction: any) {
        if (!this.grider) {
            throw 'There is not grider object';
        }

        let promise = new Promise((resolve, reject) => {
            const factory: ComponentFactory<WidgetContainerComponent> = this.compiler.resolveComponentFactory(WidgetContainerComponent)
            const component: ComponentRef<any> = container.createComponent(factory, 0, container.injector);
            let instance: any = component.instance;

            // widget of shared dashboard or not.
            widgetModel.isDashboardOwner = this._isDashboardOwner;
            widgetModel.isPredefined = this._isPredefined;
            // set widgetModel into widgetApi
            instance.setWidgetModel(widgetModel);
            // params: (html, widgetId, size_x, size_y, col, row, max_size, min_size, is_not_fade_in)
            instance.$w = this.grider.add_widget(
                instance.getEl(),
                widgetModel.widgetId,
                widgetModel.width,
                widgetModel.height,
                widgetModel.x,
                widgetModel.y,
                0, 0,
                isNotFadeIn);

            // effect when click to add widget in widget-list
            if (isNewAction) {
                this._setHighlight($(instance.getEl()));
            }

            this._beforeWidgetComponents.push({ widgetId: widgetModel.widgetId, component });
            resolve(component);
        });

        return promise;
    }

    fullSizeWidget(widget: WidgetModel, callback: any) {
        this.grider.resize_widget(
            this._getWidgetDOM(widget.widgetId),
            this.gridConfig.config.min_cols,
            this.gridConfig.config.min_rows,
            callback,
            true);
    }

    originalSizeWidget(widget: WidgetModel, callback: any) {
        this.grider.resize_widget(
            this._getWidgetDOM(widget.widgetId),
            widget.width,
            widget.height,
            callback,
            false);
    }

    highlightWidget(widgetId: any, duration: any) {
        let $dom = this._getWidgetDOM(widgetId);
        if ($dom) {
            this._setHighlight($dom, duration);
        }
    }

    _setHighlight($dom: any, duration?: any) {
        if (!duration) {
            duration = 10000;
        }

        $dom.addClass('a3-widget-active');
        setTimeout(() => {
            $dom.removeClass('a3-widget-active');
        }, duration);
    }

    highlightAppListCount(widgetId: any, duration: any) {
        let $dom = this._getWidgetDOM(widgetId).find('span.label.label-default.label-num');
        $dom.addClass('active');
        setTimeout(function () {
            $dom.removeClass('active');
        }, duration);
    }

    // There is widget place info.
    getWidget(widgetId: any) {
        if (!this.grider) {
            return;
        }

        let widgets = this.grider.serialize();
        // widgetId is string in grid
        let widget = _.findWhere(widgets, { 'widgetId': '' + widgetId });
        // set dom object
        widget.$dom = this._getWidgetDOM(widgetId);

        return widget;
    }

    removeWidget(widgetId: any) {
        this.grider.remove_widget(this._getWidgetDOM(widgetId));
        this._destroyWidgetsScope(widgetId);
    }

    _getWidgetDOM(widgetId: any) {
        let widgets = this.grider.get_widgets_with_DOM();
        let widget = _.findWhere(widgets, { 'widgetId': widgetId });
        return widget.$dom;
    }

    _destroyWidgetsScope(widgetId?: any) {
        if (this._beforeWidgetComponents.length > 0) {
            if (widgetId) {
                const obj = _.findWhere(this._beforeWidgetComponents, { widgetId: widgetId });
                obj.component.destroy();
                obj.component = null;
                this._beforeWidgetComponents = _.without(this._beforeWidgetComponents, obj);
            } else {
                this._beforeWidgetComponents.forEach((obj) => {
                    obj.component.destroy();
                    obj.component = null;
                });
                this._beforeWidgetComponents = [];
            }
        }
    }

    get() {
        return this.grider;
    }

    getGridWidth() {
        return this.grider.get_wrapper_width();
    }

    destroy() {
        if (this.grider) {
            this.grider.destroy();
        }
    }

}
