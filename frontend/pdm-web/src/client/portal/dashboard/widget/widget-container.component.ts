import {
    Component,
    ComponentRef,
    OnDestroy,
    ElementRef,
    ViewContainerRef,
    ViewChild
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
    StateManager,
    DashboardAction,
    SidebarAction,
    CommunicationAction,
    PropertiesModel,
    WidgetModel,
    RequestType,
    CurrentModel,
    SyncConditionModel,
    RouterModel,
    LinkModel
} from '../../../common';

import {
    ContextMenuService,
    SpinnerComponent,
    Util,
    Translater
} from '../../../sdk';

import { DashboardsService } from '../dashboards.service';
import { DashboardGridConfigService } from '../dashboard/grid/dashboard-grid-config.service';
import { WidgetContainerService } from './widget-container.service';
import { AutoRefreshTask } from './tasks/auto-refresh';

@Component({
    moduleId: module.id,
    selector: 'li.a3-widget-container',
    templateUrl: 'widget-container.html',
    host: {
        '[class]': 'widgetClass'
    }
})
export class WidgetContainerComponent extends AutoRefreshTask implements OnDestroy {

    widgetModel: WidgetModel;
    selectedCount: number = 0;
    syncedWidget: any;
    syncProperties: any;
    spinnerInitMessage: string = 'Loading...';
    displayConfigFormatter: any;
    displayConfigPromise: any;
    isToggleWidgetSetup: boolean = false;
    syncLabelClass: any;
    widgetClass: string;
    isBlur: boolean;
    refreshInfo: any;
    refreshTime: any;
    refreshClockTooltip: any;
    configurationTitle: string = 'Configuration';
    isDisabledConfig: boolean;

    private _widgetComponent: ComponentRef<any>;
    private _widgetApiNotifier = new Subject<RequestType>();
    private _widgetApiObservable$ = this._widgetApiNotifier.asObservable();
    private _widgetContainerNotifier = new Subject<RequestType>();
    private _widgetContainerObservable$ = this._widgetContainerNotifier.asObservable();
    private _currentSubscription: Subscription;
    private _propertiesSubscription: Subscription;
    private _inConditionSubscription: Subscription;
    private _widgetContainerSubscription: Subscription;
    private _linkSubscription: Subscription;
    private _beforeWidgetSize: any;

    @ViewChild('widgetGenerator', { read: ViewContainerRef }) widgetGeneratorEl: ViewContainerRef;
    @ViewChild('widgetHeader') widgetHeaderEl: ElementRef;
    @ViewChild('widgetBody') widgetBodyEl: ElementRef;
    @ViewChild('widgetConfig') widgetConfigEl: ElementRef;
    @ViewChild('spinner') spinner: SpinnerComponent;

    constructor(
        private stateManager: StateManager,
        private dashboardAction: DashboardAction,
        private sidebarAction: SidebarAction,
        private communicationAction: CommunicationAction,
        private dashboards: DashboardsService,
        private widgetContainer: WidgetContainerService,
        private container: ViewContainerRef,
        private contextMenuService: ContextMenuService,
        private selfElement: ElementRef,
        private translater: Translater,
        private gridConfig: DashboardGridConfigService
    ) {
        super();
    }

    setWidgetModel(widgetModel: WidgetModel) {
        this.widgetModel = widgetModel;
        this._init();
    }

    _init() {
        // add widget container host class
        this.widgetClass = `a3-widget-container gs-w ${this.stateManager.getWidgetType(this.widgetModel.widgetTypeId).name}`;
        this.isBlur = true;
        if (!this.widgetModel.isDashboardOwner) {
            this.translater.get('MESSAGE.DASHBOARD.NOT_AVAILABLE_CONFIGURATION_SHARED').subscribe((translatedMsg) => {
                this.configurationTitle = translatedMsg;
            });
        }

        this._createWidgetApi();
        this._setState();
        this._listenWigetApi();
        this._listenHeader();
        this._listenConfiguration();
    }

    /**
     * WidgetApi를 사용받은 위젯을 생성한다.
     */
    _createWidgetApi() {
        this.widgetContainer
            .createWidget(
            this._getWidgetModel(),
            this.widgetGeneratorEl,
            this.widgetBodyEl,
            this._widgetApiObservable$,
            this._widgetContainerNotifier,
            this.container.element.nativeElement,
            false
            )
            .then((cmp: ComponentRef<any>) => {
                this._widgetComponent = cmp;
                this._autoRefreshTask();
                this._drawRefreshClock();
            });
    }

    getEl() {
        return this.container.element.nativeElement;
    }

    _getWidgetModel() {
        return Util.Data.mergeDeep({}, this.widgetModel);
    }

    _autoRefreshTask() {
        const minutes = this.widgetModel.properties[LB.AUTO_REFRESH];
        if (_.isNumber(minutes)) {
            this.executeAutoRefresh(minutes);
        } else {
            this.stopAutoRefresh();
        }
    }

    _setState() {
        const current$ = this.stateManager.rxCurrent();
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }

        this._currentSubscription = current$.subscribe(
            (current: CurrentModel) => {
                if (current.actionType === ActionType.UPDATE_WIDGET_TITLE
                    && this.widgetModel.widgetId === current.widgetId) {
                    const widgetState = this.stateManager.getWidget(this.widgetModel.widgetId);
                    this.widgetModel.title = widgetState.title;
                    this.widgetModel = _.clone(this.widgetModel);
                    this._widgetApiNotifier.next({ type: A3_WIDGET.UPDATE_WIDGET, data: this._getWidgetModel() });
                }
                else if (current.actionType === ActionType.UPDATE_WIDGET
                    && this.widgetModel.widgetId === current.widgetId) {
                    const tmp = this.stateManager.getWidget(this.widgetModel.widgetId);
                    if (tmp) {
                        this.widgetModel = tmp;
                        // send widgetModel to widget.api.ts
                        this._widgetApiNotifier.next({ type: A3_WIDGET.UPDATE_WIDGET, data: this._getWidgetModel() });
                    }
                }
                else if (current.actionType === ActionType.REMOVE_WIDGET
                    && this.widgetModel.widgetId === current.widgetId) {
                    this._widgetApiNotifier.next({ type: A3_WIDGET.REMOVE_WIDGET });
                }
            },
            this._handleError
        );

        const properties$ = this.stateManager.rxProperties();
        if (this._propertiesSubscription) {
            this._propertiesSubscription.unsubscribe();
        }

        this._propertiesSubscription = properties$.subscribe(
            (properties: PropertiesModel) => {
                if (properties.actionType === ActionType.APPLY_WIDGET_PROPERTIES
                    && this.widgetModel
                    && properties.widget
                    && this.widgetModel.widgetId === properties.widget.widgetId) {
                    this.syncedWidget = null;
                    const widgetModule = this.widgetContainer.getWidgetModule(this.widgetModel);
                    const config = widgetModule.config();
                    this._widgetApiNotifier.next({
                        type: A3_WIDGET.APPLY_CONFIG_REFRESH,
                        data: {
                            widgetModel: properties.widget,
                            config: config
                        }
                    });
                    // check auto refresh
                    this._autoRefreshTask();
                }
                else if (properties.actionType === ActionType.CLOSE_WIDGET_PROPERTIES
                    && this.widgetModel
                    && properties.widget
                    && this.widgetModel.widgetId === properties.widget.widgetId) {
                    this.syncedWidget = null;
                    const widgetModule = this.widgetContainer.getWidgetModule(this.widgetModel);
                    const config = widgetModule.config();
                    this._widgetApiNotifier.next({
                        type: A3_WIDGET.CLOSE_PROPERTIES,
                        data: {
                            config: config
                        }
                    });
                }
            },
            this._handleError);

        // InCondition
        const syncCondition$ = this.stateManager.rxSyncCondition();
        if (this._inConditionSubscription) {
            this._inConditionSubscription.unsubscribe();
        }

        this._inConditionSubscription = syncCondition$.subscribe(
            (inCondition: SyncConditionModel) => {
                if (inCondition.actionType === ActionType.SYNC_OUT_CONDITION
                    && inCondition.widgetId === this.widgetModel.widgetId) {
                    // inCondition.data is CommonCondition
                    this.syncedWidget = inCondition;
                    this._highlightSyncLabel();
                    this._widgetApiNotifier.next({ type: A3_WIDGET.SYNC_INCONDITION_REFRESH, data: inCondition.data });
                    // QC 요청으로 인해 추가
                    this._drawRefreshClock();
                }
            },
            this._handleError
        );

        const link$ = this.stateManager.rxLink();
        this._linkSubscription = link$.subscribe((link: LinkModel) => {
            if (link.actionType === ActionType.LINK_SAVE_PARAMS) {
                if (+link.params['widgetId'] !== this.widgetModel.widgetId) {
                    return;
                }

                 const inCondition = {
                    actionType: 'LINK_SAVE_PARAMS',
                    widgetId: this.widgetModel.widgetId,
                    widgetTitle: this.widgetModel.title,
                    data: link.params
                }
                this.syncedWidget = inCondition;
                this._highlightSyncLabel();
            }
        });
    }

    _listenWigetApi() {
        if (this._widgetContainerSubscription) {
            this._widgetContainerSubscription.unsubscribe();
        }

        this._widgetContainerSubscription = this._widgetContainerObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === A3_WIDGET.TOOGLE_SLIDING_SETUP) {
                    this._toggleWidgetSetup();
                }
                else if (request.type === A3_WIDGET.SHOW_APP_LIST) {
                    this._showAppList(request);
                }
                else if (request.type === SPINNER.INIT) {
                    this.isBlur = true;
                    this.spinner.showSpinner(request.data.message);
                }
                else if (request.type === SPINNER.NODATA) {
                    this.isBlur = true;
                    this.spinner.showNoData(request.data.message);
                }
                else if (request.type === SPINNER.ERROR) {
                    this.isBlur = true;
                    this.spinner.showError(request.data.message);
                }
                else if (request.type === SPINNER.NONE) {
                    this.isBlur = false;
                    this.spinner.hideSpinner();
                }
                else if (request.type === 'DISABLE_CONFIG') {
                    this.isDisabledConfig = request.data;
                    if (this.isDisabledConfig) {
                        this.translater.get('MESSAGE.DASHBOARD.NOT_AVAILABLE_CONFIGURATION_NO_FORM').subscribe((translatedMsg) => {
                            this.configurationTitle = translatedMsg;
                        });
                    }
                }
            },
            this._handleError
        );
    }

    _handleError(e: any) {
        console.log('Widget Container Component, Exception', e);
    }

    /**
     * 위젯의 해더를 더블클릭하면 화면을 확대, 원위치 한다.
     */
    _listenHeader() {
        let clickStream = Observable.fromEvent(this.widgetHeaderEl.nativeElement, 'click');
        clickStream
            .buffer(clickStream.debounceTime(250))
            .map(list => list.length)
            .filter(x => x === 2)
            .subscribe(() => {
                if (this.widgetModel.isPredefined) {
                    return;
                }

                if (this.gridConfig.config.min_cols === this.widgetModel.width
                   && this.gridConfig.config.min_rows === this.widgetModel.height) {
                        if (this._beforeWidgetSize && this._beforeWidgetSize.width > 0 && this._beforeWidgetSize.height > 0) {
                            this.widgetModel.width = this._beforeWidgetSize.width;
                            this.widgetModel.height = this._beforeWidgetSize.height;
                            this.communicationAction.originalSizeWidget(this.widgetModel);
                        }
                   } else {
                        this._beforeWidgetSize = { width: this.widgetModel.width, height: this.widgetModel.height };
                        this.communicationAction.fullSizeWidget(this.widgetModel);
                   }
            });
    }

    /**
     * Widget configuration button click
     */
    _listenConfiguration() {
        let clickStream = Observable.fromEvent(this.widgetConfigEl.nativeElement, 'click');
        clickStream
            .buffer(clickStream.throttleTime(500))
            .subscribe(() => {
                if (this.widgetModel.isDashboardOwner && !this.isDisabledConfig) {
                    this._widgetApiNotifier.next({ type: A3_WIDGET.SHOW_PROPERTIES });
                }
            });
    }

    /**
     * i.e use it in recipe filter panel of RTP Report
     */
    _toggleWidgetSetup() {
        this.isToggleWidgetSetup = !this.isToggleWidgetSetup;
        // console.log('widget container toggle', this.isToggleWidgetSetup);
    }

    _showAppList(request: RequestType) {
        if (this._isDisabledMenu()) { return; }

        this._hideTooltip();

        const syncOutCondition = request.data.syncOutCondition || {};
        const appListType = request.data.appListType || undefined;
        this.sidebarAction.openSmall(ActionType.GNB_APP_LIST);
        this.communicationAction.showWidgetAppList(
            this.widgetModel.widgetId,
            this.widgetModel.properties,
            syncOutCondition,
            appListType
        );
    }

    _isDisabledMenu() {
        const widgetType = this.stateManager.getWidgetType(this.widgetModel.widgetTypeId);
        if (!widgetType) {
            return;
        }

        // TODO: conversion taskerList
        // const _drillDownRelation = taskerList.getDrillDownInfo();
        // return _drillDownRelation.widgets.hasOwnProperty(widgetType.name)
        //     && (!_drillDownRelation.widgets[widgetType.name]
        //         || _drillDownRelation.widgets[widgetType.name] === '*'
        //         || _drillDownRelation.widgets[widgetType.name].length === 0
        //     );
    }

    isDisabledSyncToOtherWidget(): any {
        if (!this.widgetModel
            || !this.widgetModel.properties) { return; }

        const communication = this.widgetModel.properties.communication;
        if ((communication
            && communication.widgets
            && (communication.widgets.length === 0))
            || this.selectedCount === 0) { return true; }

        return false;
    }

    _hideTooltip() {
        // if (this.target) {
        //     $(this.target).trigger('unfocus');
        //     this.target = undefined;
        // }
    }

    _highlightSyncLabel(duration?: any) {
        const defaultCss = 'widget-synced label label-default',
            activeCss = 'widget-synced label label-default active';

        this.syncLabelClass = activeCss;

        setTimeout(() => {
            this.syncLabelClass = defaultCss;
        }, duration || 4500);
    }

    deleteWidget() {
        this.communicationAction.removeWidget(this.widgetModel.widgetId);

        // delete other communication of widgetModel.properties.communication
        const dashboard = this.stateManager.getDashboard();
        _.each(dashboard.widgets, (widgetModel: WidgetModel) => {
            if (this.widgetModel.widgetId === widgetModel.widgetId
                || !widgetModel.properties.communication
                || !widgetModel.properties.communication.widgets) { return; }

            const filterCommunicationWidgets = _.filter(widgetModel.properties.communication.widgets, (widgetId: any) => {
                if (this.widgetModel.widgetId !== widgetId) { return widgetId; }
            });

            if (filterCommunicationWidgets.length !== widgetModel.properties.communication.widgets.length) {
                const cloneWidgetModel = Object.assign({}, widgetModel);
                cloneWidgetModel.properties.communication.widgets = filterCommunicationWidgets;

                this.dashboards
                    .updateWidget(dashboard.dashboardId, cloneWidgetModel)
                    .then((response: any) => {
                        widgetModel.properties.communication.widgets = filterCommunicationWidgets;
                        this.dashboardAction.updateWidget(widgetModel);
                    }, (error: any) => {
                        console.log('update widget communication list exception: ', error);
                    });

            }
        });
    }

    setDisplayConfiguration(configFormatter: any, promise: any) {
        this.displayConfigFormatter = configFormatter;
        this.displayConfigPromise = promise;
    }

    syncLabelClick(event: any) {
        // TODO : check sync label size
        // this._openSyncLabelTooltip(event);
    }

    _openSyncLabelTooltip(event: any) {
        const config: any = {
            type: A3_CONFIG.TOOLTIP.TYPE.PLAIN,
            event: event,
            options: {
                content: `Synced from ${this.syncedWidget.widgetTitle}`
            }
        };
        this.contextMenuService.openTooltip(config);
    }

    refresh() {
        this.syncedWidget = null;
        this._widgetApiNotifier.next({ type: A3_WIDGET.JUST_REFRESH });

        this._drawRefreshClock();
    }

    _drawRefreshClock() {
        let now = new Date();
        this.refreshInfo = [{
            'unit': 'minutes',
            'value': now.getMinutes()
        }, {
            'unit': 'hours',
            'value': now.getHours()
        }];

        // add space in front/back for tooltip string
        this.refreshTime = `Refresh Time: ${Util.Date.format(now, 'lll')}`;
    }

    /**
     * _listenConfiguration() 사용하면서 아래 로직 사용하지 않음
     */
    openConfiguration() {
        console.log('openConfiguration : ', this.widgetModel);
        if (this.widgetModel.isDashboardOwner && !this.isDisabledConfig) {
            this._widgetApiNotifier.next({ type: A3_WIDGET.SHOW_PROPERTIES });
        }
    }

    clearSelectedItems() {
        this.selectedCount = 0;
    }

    setSpinnerInitMessage(message: string) {
        this.spinnerInitMessage = message;
    }

    ngOnDestroy() {
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }

        if (this._propertiesSubscription) {
            this._propertiesSubscription.unsubscribe();
        }

        if (this._inConditionSubscription) {
            this._inConditionSubscription.unsubscribe();
        }

        if (this._widgetContainerSubscription) {
            this._widgetContainerSubscription.unsubscribe();
        }

        if (this._linkSubscription) {
            this._linkSubscription.unsubscribe();
        }

        if (this._widgetComponent) {
            this._widgetComponent.destroy();
            this._widgetComponent = null;
        }

        if (this.selfElement) {
            $(this.selfElement.nativeElement).remove();
        }

        this.stopAutoRefresh();
    }
}

