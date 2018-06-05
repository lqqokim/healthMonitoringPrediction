import { Component, Input, OnInit, OnChanges, OnDestroy, ViewChild, ViewContainerRef, ComponentRef } from '@angular/core';

import {
    StateManager,
    DashboardAction,
    SidebarAction,
    PageAction,
    CommunicationModel,
    DashboardModel,
    PropertiesModel,
    SyncConditionModel
} from '../../../../common';

import { NotifyService } from '../../../../sdk';

import { DashboardGridService } from './dashboard-grid.service';
import { DashboardsService } from '../../dashboards.service';
import { DashboardGridConfigService } from './dashboard-grid-config.service';

@Component({
    moduleId: module.id,
    selector: 'div.gridster',
    template: `
        <ul class="gridster-layout">
            <div #children></div>
        </ul>
    `
})
export class DashboardGridComponent implements OnInit, OnChanges, OnDestroy {

    @Input() dashboard: DashboardModel;
    @ViewChild('children', { read: ViewContainerRef }) container: ViewContainerRef;

    grider: any;
    private _unListenDragStart: any;
    private _unListenDragStop: any;
    private _unListenResize: any;
    private _unListenResizing: any;
    private _unBrowserResizing: any;
    private _communicationSubscription: any;
    private _propertiesSubscription: any;
    private _inConditionSubscription: any;

    constructor(
        private dashboardGrid: DashboardGridService,
        private gridConfig: DashboardGridConfigService,
        private stateManager: StateManager,
        private dashboardAction: DashboardAction,
        private sidebarAction: SidebarAction,
        private pageAction: PageAction,
        private dashboards: DashboardsService,
        private notify: NotifyService
    ) { }

    ngOnChanges(changes: any) {
        const currentDashboard = changes['dashboard'].currentValue;
        if (currentDashboard) {
            this._removeGrider();
            this.grider = this.dashboardGrid.createGrider(this.container);
            this._show(currentDashboard);
        }
    }

    ngOnInit() {
        this._setState();
        this._listenChangedPositionWidgets();
    }

    _show(currentDashboard: DashboardModel) {
        this.dashboardGrid.init(
            currentDashboard,
            this.container
        );
        // must call to show widgets with fadeIn
        this.grider.show_widgets(1);
    }

    _setState() {
        let communication$ = this.stateManager.rxCommunication();
        this._communicationSubscription = communication$.subscribe(
            (communication: CommunicationModel) => {
                if (communication.actionType === ActionType.COMMUNICATION_ADD_WIDGET) {
                    this._addWidget();
                } else if (communication.actionType === ActionType.COMMUNICATION_FULLSIZE_WIDGET) {
                    this._fullSizeWidget();
                } else if (communication.actionType === ActionType.COMMUNICATION_ORIGINALSIZE_WIDGET) {
                    this._originalSizeWidget();
                } else if (communication.actionType === ActionType.COMMUNICATION_REMOVE_WIDGET) {
                    this._removeWidget();
                }
            },
            this._handleError
        );

        this._setHightligth();
    }

    _setHightligth() {
        const properties$ = this.stateManager.rxProperties();
        this._propertiesSubscription = properties$.subscribe(
            (properties: PropertiesModel) => {
                if (properties.actionType === ActionType.APPLY_WIDGET_PROPERTIES
                    && properties.widget) {
                    this._highlight(properties.widget.widgetId, 5000);
                }
            },
            this._handleError
        );

        // InCondition
        const syncCondition$ = this.stateManager.rxSyncCondition();
        this._inConditionSubscription = syncCondition$.subscribe(
            (inCondition: SyncConditionModel) => {
                if (inCondition.actionType === ActionType.SYNC_OUT_CONDITION) {
                    this._highlight(inCondition.widgetId, 5000);
                }
            },
            this._handleError
        );
    }

    _handleError(e: any) {
        console.log('Dashboar Grid Component, Exception', e);
    }

    _highlight(widgetId: number, timeout: number) {
        setTimeout(() => {
            this.dashboardGrid.highlightWidget(widgetId, 5000);
        }, 100);
    }

    _listenChangedPositionWidgets() {
        const griderDOM = this.grider.get_$el_DOM();
        if (!griderDOM) {
            throw 'Check there is not grid DOM';
        }

        this._unListenDragStart = griderDOM.on('gridster:dragstart', (evt: any) => {
            // when opened "drill-down popover" for tasker list, if you drag widget container, must hide popover drill-down menu
            const popoverDom = $('.a3p-popover-drilldown-menu');
            if (popoverDom.length === 1) {
                popoverDom.trigger('drilldown-popover-menu:hide');
            }
        });

        this._unListenDragStop = griderDOM.on('gridster:dragstop', (evt: any) => {
            this._checkChangedWidgetPosition();
        });

        this._unListenResize = griderDOM.on('gridster:resizestop', (evt: any, widgetId: any) => {
            this._checkChangedWidgetPosition();
            // // resize specific widget
            if (widgetId > 0) {
                this._checkResizeWidgets(widgetId);
            }
        });

        this._unBrowserResizing = griderDOM.on('gridster:resizebrowser', (evt: any) => {
            // resize all widgets
            this._checkResizeWidgets();
        });

        // 만일 widget width가 130px 이하이면 overflow:hidden style을 widget header에 강제로 적용한다.
        // .widget-set-group, .a3-widget-header must be overflow:hidden under 130px width of widget size
        this._unListenResizing = griderDOM.on('gridster:resize', (evt: any, resize_widget: any, width: any, height: any) => {
            const $resize_widget = $(resize_widget);
            if (width <= 130) {
                $resize_widget.find('.widget-set-group').css({ 'overflow': 'hidden' });
                $resize_widget.find('.a3-widget-header').css({ 'overflow': 'hidden' });
            } else {
                $resize_widget.find('.widget-set-group').css({ 'overflow': '' });
                $resize_widget.find('.a3-widget-header').css({ 'overflow': '' });
            }
        });
    }

    /**
     * isForce: when click double on head of widget conatiner for backing original size 
     * @see _originalSizeWidget
     * @param isForce 
     */
    _checkChangedWidgetPosition(isForce: boolean = false) {
        const dashboardId = this.stateManager.getCurrentDashboardId();
        const currentPage = this.stateManager.getCurrentDashboardPage();
        const prevWidgets = this.stateManager.getWidgets(dashboardId);

        _.each(this.grider.serialize(), (widget: any) => {
            let prevWidget: any = _.findWhere(prevWidgets, {
                widgetId: parseInt(widget.widgetId, 10)
            });
            if (prevWidget.x !== widget.col
                || prevWidget.y !== widget.row
                || prevWidget.width !== widget.size_x
                || prevWidget.height !== widget.size_y
                || isForce) {

                let updatedWidget = {
                    widgetId: prevWidget.widgetId,
                    title: prevWidget.title,
                    x: widget.col,
                    y: widget.row,
                    width: widget.size_x,
                    height: widget.size_y,
                    properties: prevWidget.properties,
                    // set current page number
                    page: currentPage
                };

                // update database for widget's position
                this.dashboards
                    .updateWidget(dashboardId, updatedWidget)
                    .then(() => {
                        // and then dashboardAction
                        this.dashboardAction.updateWidgetSize(updatedWidget);
                        this.pageAction.checkPage(ActionType.UPDATE_WIDGET_SIZE);
                    }, (error: any) => {
                        console.log('update widget during changing position time, exception ', error);
                    });

            }
        });
    }

    _checkResizeWidgets(widgetId?: any) {
        if (widgetId) {
            //console.log('resize specific widget ', widgetId);
        } else {
            //console.log('resize all widgets');
        }

    }

    _fullSizeWidget() {
        const params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_FULLSIZE_WIDGET);
        if (!params) {
            return;
        }

        const widget = params.widget;
        this.dashboardGrid.fullSizeWidget(widget, () => {
            setTimeout(() =>  this._checkChangedWidgetPosition(), 10);
        });
    }

    _originalSizeWidget() {
        const params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_ORIGINALSIZE_WIDGET);
        if (!params) {
            return;
        }

        const widget = params.widget;
        this.dashboardGrid.originalSizeWidget(widget, () => {
            setTimeout(() =>  this._checkChangedWidgetPosition(true), 10);
        });
    }

    _addWidget() {
        const params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_ADD_WIDGET);
        if (!params) {
            return;
        }

        // predefine widget: x, y is initial value
        let newWidget: any = {
            dashboardId: params.dashboardId,
            widgetTypeId: params.widget.widgetTypeId,
            title: params.widget.title,
            x: 0,
            y: 0,
            width: params.widget.width,
            height: params.widget.height,
            conditions: {},
            properties: {
                from: '',
                to: '',
                communication: {
                    widgets: []
                }
            },
            page: params.currentPage
        };

        this.dashboards
            .createWidget(params.dashboardId, newWidget)
            .then((widget: any) => {
                // set widget additional properties, check dashboardAction.addWidget
                widget.selected = false;
                widget.selectedItems = [];

                // use index number in dynamicresolver for creating component 
                let dashboard = this.stateManager.getDashboard(params.dashboardId);
                let idx = dashboard.widgets.length;

                // add widget in grid
                this.dashboardGrid
                    .addWidget(params.dashboardId, widget, this.container, idx, false, true)
                    .then(() => {

                        // update x, y grid's point value
                        const widgetInfo: any = this.dashboardGrid.getWidget(widget.widgetId);
                        widget.x = widgetInfo.col;
                        widget.y = widgetInfo.row;

                        // update widget x, y in database
                        // TODO succeed to update and then call dashboardAction
                        this.dashboards
                            .updateWidget(params.dashboardId, widget)
                            .then(() => {
                                this.dashboardAction.addWidget(widget);
                                this.notify.success('MESSAGE.GENERAL.ADDED_WIDGET');

                                // auto scroll down
                                let scrollHeight = 0;
                                if (widgetInfo.row !== 1) {
                                    scrollHeight = (
                                        (widgetInfo.row + widgetInfo.size_y) * this.gridConfig.config.widget_base_dimensions[1]
                                    ) - 40;
                                }

                                $('#dashboard-scroll-area').delay(300).animate({
                                    scrollTop: scrollHeight
                                }, 500, () => {
                                    //widgetInfo.$dom.css('opacity', '0.5');
                                });

                                setTimeout(() => this.pageAction.checkPage(ActionType.ADD_WIDGET), 501);
                            }, (error: any) => {
                                this.pageAction.checkPage(ActionType.ADD_WIDGET);
                                this.notify.error('MESSAGE.GENERAL.ADDING_ERROR_WIDGET');
                                console.log('update widget during creation time, exception ', error);
                            });
                    });
            }, (error: any) => {
                console.log('create widget exception: ', error);
            });
    }

    _removeWidget() {
        let params = this.stateManager.getCommunicationParams(ActionType.COMMUNICATION_REMOVE_WIDGET);
        if (!params) {
            return;
        }

        // TODO delete Widget
        this.dashboards
            .deleteWidget(params.dashboardId, params.widgetId)
            .then(() => {
                // remove widget in grid
                this.dashboardGrid.removeWidget(params.widgetId);
                // remove widget in database
                this.dashboardAction.removeWidget(params.widgetId);
                this.pageAction.checkPage(ActionType.REMOVE_WIDGET);
                this.notify.success('MESSAGE.GENERAL.REMOVED_WIDGET');

                // if dashboard
                if (!this.stateManager.isExistWidgets()) {
                    setTimeout(() => {
                        this.sidebarAction.openSmall(ActionType.GNB_WIDGET_LIST);
                    }, 100);
                }
            }, (error: any) => {
                this.notify.error('MESSAGE.GENERAL.REMOVING_ERROR_WIDGET');
                console.log('delete widget exception: ', error);
            });
    }

    _removeGrider() {
        if (this.grider) {
            this.grider.destroy();
            this.grider = undefined;
        }
    }

    ngOnDestroy() {
        if (this._communicationSubscription) {
            this._communicationSubscription.unsubscribe();
        }

        if (this._propertiesSubscription) {
            this._propertiesSubscription.unsubscribe();
        }

        if (this._inConditionSubscription) {
            this._inConditionSubscription.unsubscribe();
        }

        if (this._unListenDragStart && this._unListenDragStart.unbind) {
            this._unListenDragStart.unbind('gridster:dragstart');
        }

        if (this._unListenDragStop && this._unListenDragStop.unbind) {
            this._unListenDragStop.unbind('gridster:dragstop');
        }

        if (this._unListenResize && this._unListenResize.unbind) {
            this._unListenResize.unbind('gridster:resizestop');
        }

        if (this._unListenResizing && this._unListenResizing.unbind) {
            this._unListenResizing.unbind('gridster:resize');
        }

        if (this._unBrowserResizing && this._unBrowserResizing.unbind) {
            this._unBrowserResizing.unbind('gridster:resizebrowser');
        }

        this._removeGrider();
    }
}
