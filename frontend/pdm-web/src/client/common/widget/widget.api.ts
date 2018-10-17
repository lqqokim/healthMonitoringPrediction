/**
 * Widget을 생성을 할 때 항시 상속바아야 하는 클래스
 */

import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { WidgetModel } from '../app-state/dashboard/dashboard.type';
import { SyncConditionAction } from '../app-state/sync-condition/sync-condition.action';
import { ContextMenuAction } from '../app-state/context-menu/context-menu.action';
import { PropertiesAction } from '../app-state/properties/properties.action';
import { ContextMenuModel } from '../app-state/context-menu/context-menu.type';
import { ContextMenuRequester } from '../popup/context-menu/context-menu-requester';
import { ConditionBuilder } from '../condition/builder/condition-builder';
import { ConditionGroup } from '../condition/builder/condition-group';
import { ConditionType } from '../condition/condition.type';
import { CommonCondition } from '../condition/common-condition';
import { ConditionApi } from '../condition/condition.api';
import { WidgetRefreshType } from './widget.type';
import { RequestType } from '../types/common.type';

import { ModalApi } from '../popup/modal/modal.api';

import {
    InjectorUtil,
    ContextMenuType,
    Util,
    NotifyService
} from '../../sdk';
import {
    ContextMenuTemplateInfo,
    ViewApi,
    PageAction,
    StateManager,
    LinkModel
} from '../../common';

export abstract class WidgetApi extends ModalApi {

    protected charts: any = [];
    protected resize: any = {};

    private _widgetModel: WidgetModel;
    private _widgetBodyEl: ElementRef;
    private _containerElement: any;

    private _propertiesConfig: ConditionApi | any;
    private _propertiesGroup: ConditionGroup;

    private _inConditionConfig: ConditionApi | any;
    private _outConditionConfig: ConditionApi | any;

    private _viewConfig: ViewApi | any;

    private _isSynced: boolean;

    private _widgetApiSubscription: Subscription;
    private _widgetContainerNotifier: Subject<RequestType>;

    // use Context Menu
    private _widgetApiRequesterSubscription: Subscription;
    private _widgetApiRequester = new Subject<RequestType>();
    private _widgetApiRequesterObservable$ = this._widgetApiRequester.asObservable();
    private _openContextUid: string;
    private _openContextEventType: string;
    private _debounceShowContextMenu = _.debounce(this._showContextMenu, 300);

    // configuaration info
    private configuarationInfo: any;

    // for resize
    private DEBOUNCE_TIME: number = 100;
    private _resizeNotify = new Subject<any>();
    private _resizeObservable$ = this._resizeNotify.asObservable();
    private _windowReszieSubscription: Subscription;

    private _uuid: any;
    private _notify: NotifyService;

    private _isConfigurationMode: boolean;
    private _isConfigurationWidget: boolean;
    // chartConfig를 class로 구성하고 new한 경우
    private _chartConfigInstance: any;
    private _linkSubscription: Subscription;

    /**
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *   - justRefresh : click button을 눌렀을 경우. 다시 properties를 참조해서 refresh 한다. Sync되었던 InCondition은 무시된다.
     *   - applyConfig : widget configuration을 새롬게 설정했을 경우. 새로운 properties를 가져와 refresh 한다.
     *   - syncInCondition : InCondition 이 왔을 경우. Condition validation 후에 refresh 한다.
     */
    abstract refresh(type?: WidgetRefreshType): void;

    constructor() {
        super();
        this._uuid = `widget-${Util.UUID.new()}`;
        this._listenInternal();
        this._notify = InjectorUtil.getService(NotifyService);
    }

    /**
     * Widget 내부에서 요청되는 것만을 처리한다.
     */
    _listenInternal() {
        // 위젯 자체 안에서 요청만을 리스닝처리한다.
        this._widgetApiRequesterSubscription = this._widgetApiRequesterObservable$.subscribe(
            (request: RequestType) => {
                // at first, close context-menu
                this.closeContextMenu();

                if (request.type === A3_WIDGET.SYNC_OUTCONDITION_REQUEST) {
                    this._sendOutCondition(request.data);
                }
                if (request.type === A3_WIDGET.SYNC_TRANS_CALLBACK_REQUEST) {
                    // 컨텍스트 메뉴에서 보낼 Out Condition객체를 위젯의 callback 메소드에서 조작하고 싶을 경우
                    // syncCallback을 등록한다.
                    // @see context-menu.type.ts
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                } else if (request.type === A3_WIDGET.SHOW_APP_LIST) {
                    this._widgetContainerNotifier.next(request);
                } else if (request.type === A3_WIDGET.SHOW_DETAIL_VIEW) {
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                } else if (request.type === A3_WIDGET.DESTROY_CONTEXT_REQUEST) {
                    this.closeContextMenu();
                } else if (request.type === A3_WIDGET.INTERNAL_ACTION) {
                    // 컨텍스트 메뉴의 Dispaly영역에 버튼을 클릭 했을 경우.
                    // InternalActionType을 등록한다.
                    // InternalActionType 형태로 보내면 data안에 callback을 체크해서 호출해준다.
                    // @see context-menu.type.ts
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                } else if (request.type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
                    // use widget-configuration-container.component.ts
                    let widgetModel: WidgetModel = request.data;
                    this.displayConfiguaration(false);
                    this._createPropertiesGroup();
                    // return promise in checking preInit
                    this._propertiesConfig
                        .initModel(widgetModel.properties)
                        .then(() => {
                            request.data = this.getProperties();
                            this.refresh(request);
                        });
                } else if (request.type === A3_WIDGET.ADD_COMMENT) {
                    // TODO in the future
                } else if (request.type === A3_WIDGET.CONTEXT_TICK_CLICK) {
                    // TODO in the future
                }
            },
            this._handleError
        );
    }

    /**
     * 대시보드 전체, 즉, Application 레밸의 요청과 Widget Container 요청을 처리한다
     */
    listenContainer(widgetApiObservable$: Observable<RequestType>, widgetContainerNotifier: Subject<RequestType>) {
        // setup notifier to widget-container
        this._widgetContainerNotifier = widgetContainerNotifier;

        // form length를 통해 widget container의 configuration icon 에 대한 disable을 결정한다
        this._sendFormConfiglength();

        // email, notification link - sync data
        this._setLink();

        // listen it from widget-container or context-menu
        this._widgetApiSubscription = widgetApiObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === A3_WIDGET.SHOW_PROPERTIES) {
                    let cloneWidgetModel = Util.Data.mergeDeep({}, this.widgetModel);
                    if (this._propertiesConfig && this._propertiesConfig.form) {
                        cloneWidgetModel.form = this._propertiesConfig.form();
                    }
                    const propertiesAction: PropertiesAction = InjectorUtil.getService(PropertiesAction);
                    propertiesAction.openWidgetConfiguration(cloneWidgetModel);

                    this._isConfigurationMode = true;
                } else if (request.type === A3_WIDGET.CLOSE_PROPERTIES) {
                    // this._resetOriginalWidgetApi(request.data.config);
                    this._isConfigurationMode = false;
                } else if (request.type === A3_WIDGET.JUST_REFRESH) {
                    if (this.widgetModel.filters) {
                        this.widgetModel.filters = undefined;
                    }
                    request.data = this.getProperties();
                    this.displayConfiguaration(false);
                    this.refresh(request);
                } else if (request.type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
                    // let widgetModel: WidgetModel = request.data;
                    this._widgetModel = request.data.widgetModel;
                    this.displayConfiguaration(false);
                    this._createPropertiesGroup();
                    // return promise in checking preInit
                    // this._resetOriginalWidgetApi(request.data.config);
                    this._propertiesConfig
                        .initModel(this._widgetModel.properties)
                        .then(() => {
                            request.data = this.getProperties();
                            this.refresh(request);
                        });
                } else if (request.type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
                    this._isSynced = true;
                    // Checking Validation
                    const mappedData = this._getInCondition(request.data);
                    if (mappedData) {
                        request.data = mappedData;
                        this.displayConfiguaration(true);
                        this.refresh(request);
                    } else {
                        // TODO
                        // notify
                    }
                } else if (request.type === A3_WIDGET.UPDATE_WIDGET) {
                    this._widgetModel = request.data;
                } else if (request.type === A3_WIDGET.REMOVE_WIDGET) {
                    this.destroy();
                }
            },
            this._handleError
        );
    }

    _setLink() {
        const stateManager: StateManager = InjectorUtil.getService(StateManager);
        const link$ = stateManager.rxLink();
        this._linkSubscription = link$.subscribe((link: LinkModel) => {
            if (link.actionType === ActionType.LINK_SAVE_PARAMS) {
                if (+link.params['widgetId'] !== this._widgetModel.widgetId) {
                    return;
                }

                // this.displayConfiguaration(true);
                this.refresh({
                    type: A3_WIDGET.LINK_INCONDITION_REFRESH,
                    data: link.params
                });
            }
        });
    }

    _sendFormConfiglength() {
        if (this._propertiesConfig && this._propertiesConfig.form && this._propertiesConfig.form().length > 0) {
            this._widgetContainerNotifier.next({ type: 'DISABLE_CONFIG', data: false });
        } else {
            this._widgetContainerNotifier.next({ type: 'DISABLE_CONFIG', data: true });
        }
    }

    _handleError(e: any) {
        console.log('Widget API, Exception', e);
    }

    // deprecated it because chartconfig is changed into Class Type
    // private _resetOriginalWidgetApi(config: any) {
    //     if (_.isArray(config.chartConfigs)) {
    //         config.chartConfigs.forEach((chartConfig: any) => {
    //             chartConfig(this);
    //         });
    //     }
    // }

    setInfo(widgetModel: WidgetModel, widgetBodyEl: ElementRef, containerElement: any, isConfigurationWidget?: boolean) {
        this._widgetModel = widgetModel;
        this._widgetBodyEl = widgetBodyEl;
        this._containerElement = containerElement;
        this._isConfigurationWidget = isConfigurationWidget;
        this.log('--- widget name', this._widgetModel.title, ', Id', this._widgetModel.widgetId);
        this.setStatePropertiesFromCookie();
    }

    setStatePropertiesFromCookie() {
        let jsonString: string = Util.Data.getCookie(`widget-${this._widgetModel.widgetId}`);
        let jsonObject: any = {};
        if (!Util.Validate.isEmpty(jsonString)) {
            jsonObject = JSON.parse(jsonString);
        }
        this._widgetModel.stateProperties = Util.Validate.isEmpty(jsonObject) ? {} : jsonObject;
    }

    get widgetModel() {
        return this._widgetModel;
    }

    get requester() {
        return this._widgetApiRequester;
    }

    get isConfigurationWidget() {
        return this._isConfigurationWidget;
    }

    get isConfigurationMode() {
        return this._isConfigurationMode;
    }

    setChartConfigInstance(configInstance: any) {
        this._chartConfigInstance = configInstance;
    }

    getChartConfigInstance() {
        return this._chartConfigInstance;
    }

    getContainerElement() {
        return this._containerElement;
    }

    getLazyLayout() {
        let lazyLayout = _.debounce(() => {
            // console.log(`_setTriggerWindowReszie ==> ${this.widgetModel.widgetId}`);
            const evt = window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, this.DEBOUNCE_TIME);
        return lazyLayout;
    }

    /**
    * When resize wiget container, trigger window resize event
    * Not Used
    */
    enableWindowResizeTrigger() {
        // Duplicated
        // new ResizeSensor(this._containerElement, () => {
        //     this._resizeNotify.next(`resize:wiget-container:${this.widgetModel.widgetId}`);
        // });

        // // enable subscribe
        // this._windowReszieSubscription = this._resizeObservable$
        //     .debounce((x: any) => Observable.timer(this.DEBOUNCE_TIME))
        //     .subscribe((req: any) => {
        //         // console.log(`_setTriggerWindowReszie ==> ${this.widgetModel.widgetId}`);
        //         var evt = window.document.createEvent('UIEvents');
        //         evt.initUIEvent('resize', true, false, window, 0);
        //         window.dispatchEvent(evt);
        //     });
        if (this._isConfigurationWidget) {
            $('.a3-configuration-wrapper').resize(this.getLazyLayout());
        } else {
            $(this._containerElement).resize(this.getLazyLayout());
        }
    }


    /************************************************************************
     *
     * CONTEXT MENU
     *
     * 1) 위젯의 차트들은 템플릿 종류와 템플릿 매핑 데이터 그리고 컨디션 데이터를 준다.
     * 2) WidgetApi 는 컨텍스트 메뉴를 띄워준다.
     *    (Sync를 할 수 있는 위젯인지 아닌지 판단한다)
     * 3) Sync button을 클릭하면 그때 SyncAction을 수행한다.
     *
     ************************************************************************/
    showContextMenu(cm: ContextMenuType) {
        // TODO : underscore.debounce -> Observable.debounce
        if (this._isClickEvent(cm)) {
            this._showContextMenu(cm);
        } else if (this._isValidOverContext(cm)) {
            this._debounceShowContextMenu(cm);
        }
    }

    _showContextMenu(cm: ContextMenuType) {
        // console.log('widgetApi :: _showContextMenu ', this._isValidOverContext(cm));
        // 열려있는 context 체크
        // if (!this._isValidOverContext(cm)) return;
        // showContextMenu
        if (this._isValidContext(cm)) {
            this._initContextMenuType(cm);
            this._outConditionConfig.clearCondition();
            const contextMenu: ContextMenuModel = {
                id: this._widgetModel.widgetId,
                tooltip: cm.tooltip,
                template: cm.template,
                outCondition: cm.outCondition,
                contextMenuAction: cm.contextMenuAction,
                contextMenuOption: cm.contextMenuOption,
                requester: new ContextMenuRequester(this._widgetApiRequester, cm)
            };
            const action: ContextMenuAction = InjectorUtil.getService(ContextMenuAction);
            action.showContextMenu(contextMenu);
        }
    }

    closeOverContextMenu(event: any = null) {
        // console.log('widgetApi :: closeOverContextMenu ');
        let isOverEvent: boolean = this._openContextEventType !== A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK;
        let isTickPosition: boolean = this.isOpenContextMenu() ? Util.Context.isTickPosition(event) : false;
        if (isOverEvent && !isTickPosition) {
            this.closeContextMenu();
        }
    }

    closeContextMenu() {
        // console.log('widgetApi :: closeContextMenu :', this._openContextUid);
        if (this.isOpenContextMenu()) {
            this._openContextUid = null;
            this._openContextEventType = null;
            const action: ContextMenuAction = InjectorUtil.getService(ContextMenuAction);
            action.closeContextMenu(this._widgetModel.widgetId);
        }
    }

    isOpenContextMenu(): boolean {
        return Util.Data.isNotNull(this._openContextUid);
    }

    isOpenOverContextMenu(): boolean {
        return (this._openContextUid && this._openContextEventType === A3_CONFIG.TOOLTIP.EVENT_TYPE.OVER);
    }

    _initContextMenuType(cm: ContextMenuType): void {
        this._openContextUid = Util.Data.nvl(cm.tooltip.uid, Util.UUID.new());
        this._openContextEventType = this._isClickEvent(cm) ? A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK : A3_CONFIG.TOOLTIP.EVENT_TYPE.OVER;

        cm.tooltip.eventType = this._isClickEvent(cm) ? A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK : A3_CONFIG.TOOLTIP.EVENT_TYPE.OVER;
        cm.tooltip.options = this._getTooltipOptions(cm);
        cm.tooltip.type = A3_CONFIG.TOOLTIP.TYPE.CHART;
        cm.template.type = cm.template.type || ContextMenuTemplateInfo.WIDGET_COMMON;
        cm.template.title = cm.template.title || this._widgetModel.title;
        cm.template.data = this._getTemplateData(cm);
        cm.outCondition = cm.outCondition || { data: {} };
        cm.contextMenuAction = this._makeContextMenuAction(cm);
    }

    _isValidContext(cm: ContextMenuType) {
        // over event && current element is hover
        if (!this._isClickEvent(cm)
            && cm.tooltip.event
            && !$(cm.tooltip.event.target).is(':hover')) {
            return false;
        } else if (this._isClickEvent(cm)
            || Util.Data.isNull(this._openContextUid)
            || this._openContextUid !== cm.tooltip.uid) {
            return true;
        }
        return false;
    }

    // 삭제예정
    _isValidOverContext(cm: ContextMenuType) {
        // 열려있는 context가 over context && _openContextUid가 지금 uid랑 다른 경우만 context를 show 해준다
        if (!this._isClickEvent(cm)
            && this._openContextUid
            && this._openContextUid === cm.tooltip.uid) {
            return false;
        }
        return true;
    }

    _getTooltipOptions(cm: ContextMenuType): any {
        let options = cm.tooltip.options || {};
        if (this._isClickEvent(cm)) {
            options.hide = { event: 'unfocus' };
        } else {
            options.hide = { fixed: true };
        }
        return options;
    }

    _getTemplateData(cm: ContextMenuType): any {
        if (cm.template.data && ContextMenuTemplateInfo.isViewDataTemplate(cm.template.type)) {
            return this.getViewData(cm.template.data['config'], false, true, cm.template.data);
        }
        return cm.template.data;
    }

    _makeContextMenuAction(cm: ContextMenuType) {
        if (cm.contextMenuAction) {
            return Object.assign(this._getContextMenuAction(cm), cm.contextMenuAction);
        } else {
            return this._getContextMenuAction(cm);
        }
    }

    _isClickEvent(cm: ContextMenuType) {
        let eventType: string = cm.tooltip.eventType;
        let event: any = cm.tooltip.event;
        if (eventType === A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK) {
            return true;
        } else if (event && event.type && event.type.toLowerCase().indexOf('click') > -1) {
            return true;
        }
        return false;
    }

    _getContextMenuAction(cm: ContextMenuType) {
        return {
            invisible: this._isContextMenuActionInvisible(cm),
            disableCommnet: true,
            invisibleComment: false,
            disableAppList: false,
            invisibleAppList: false,
            disableDetailView: true,
            invisibleDetailView: false,
            disableSync: this._isDisableSyncOutCondition(),
            invisibleSync: false
        };
    }

    _isContextMenuActionInvisible(cm: ContextMenuType): boolean {
        let invisible: boolean = false;
        if (this._isConfigurationWidget) {
            invisible = true;
        } else if (cm.contextMenuAction) {
            invisible = cm.contextMenuAction.invisible ? cm.contextMenuAction.invisible : !this._isClickEvent(cm);
        } else {
            invisible = !this._isClickEvent(cm);
        }
        return invisible;
    }

    /************************************************************************
     *
     * View Config
     *
     * context-menu, tooltip, configuration
     *
     ************************************************************************/
    setViewConfig(viewConfig: ViewApi) {
        this._viewConfig = viewConfig;
    }

    // tslint:disable-next-line:no-empty
    _getViewConditionType() {

    }

    // TODO parameter 정리 필요
    getViewData(config: string, isSynced: boolean = false, isConditionType: boolean = false, data: any = null) {
        if (!this._viewConfig) {
            this.warn(`You don't have View Config ${this._widgetModel.widgetId}. Please setup View Config in your module.ts`);
            return;
        }

        this._viewConfig.initModel(this._widgetModel.properties);
        if (data) {
            // set context-menu data
            this._viewConfig.setViewData(data);
        } else {
            // clear context-menu data
            this._viewConfig.setViewData(undefined);
        }

        const viewConfigTypes = this._viewConfig[config]();
        const name = `ViewConfig-[${this._widgetModel.title}::${this._widgetModel.widgetId}::${config}()]`;
        if (!viewConfigTypes) { return; }

        let useApi: any = isSynced ? this._inConditionConfig : this._viewConfig;
        let viewConfigGroup = ConditionBuilder.createConditionGroup(viewConfigTypes, name);
        let views: any = viewConfigGroup.getConditions(useApi, isConditionType);

        viewConfigGroup.clear();
        viewConfigGroup = null;

        // must set config
        // @see use it config properties in showContextMenu
        views['config'] = config;
        return views;
    }


    /************************************************************************
     *
     * PROPERTIES
     *
     * call from widget-container.ts when create widget, setup widget.module
     *
     ************************************************************************/
    setPropertiesConfig(propertiesApi: ConditionApi): Promise<any> {
        this._propertiesConfig = propertiesApi;
        this._createPropertiesGroup();
        // last init
        return this._propertiesConfig.initModel(this._widgetModel.properties, true);
    }

    _createPropertiesGroup() {
        let conditionTypes: ConditionType[];
        try {
            conditionTypes = this._propertiesConfig.config();
            this._addCommunicationInProperties(conditionTypes);
        } catch (e) {
            this.warn('There is no properties config() method');
            return;
        }

        if (conditionTypes) {
            if (this._propertiesGroup) {
                this._propertiesGroup.clear();
            }

            const name = `Properties-[${this._widgetModel.title}::${this._widgetModel.widgetId}]`;
            this._propertiesGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        }
    }

    _addCommunicationInProperties(conditionTypes: ConditionType[]) {
        let isComm: boolean = false;
        conditionTypes.forEach((ct) => {
            if (ct.name === 'communication') {
                isComm = true;
                return;
            }
        });
        if (!isComm) {
            conditionTypes.push(
                {
                    name: 'communication',
                    isGroup: true,
                    value: [{ name: 'widgets' }]
                }
            );
        }
    }

    getProperties() {
        return this._propertiesGroup.getConditions(this._propertiesConfig);
    }

    getStateProperties() {
        return this._widgetModel.stateProperties;
    }


    /************************************************************************
     *
     * OUT CONDITION
     *
     * call from widget-container.ts when create widget, setup widget.module
     *
     ************************************************************************/
    setOutConditionConfig(outConditionConfig: ConditionApi) {
        this._outConditionConfig = outConditionConfig;
    }

    /**
     * 위젯에서 호출한 후 데이터를 설정한다.
     */
    getOutCondition(config: string) {
        if (!this._outConditionConfig) {
            this.warn(`You don't have Out-Condition ${this._widgetModel.widgetId}. Please setup Out-Condition in your module.ts`);
            return;
        }

        const conditionTypes = this._getConditionTypes('out', config);
        if (!conditionTypes) { return; }

        const name = `OutCondition-[${this._widgetModel.title}::${this._widgetModel.widgetId}::${config}()]`;
        let outConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        this._outConditionConfig.initModel(this._widgetModel.properties);
        let conditions: any = outConditionGroup.getConditions(this._outConditionConfig);

        outConditionGroup.clear();
        outConditionGroup = null;

        // must set config
        // @see use it config properties in showContextMenu
        conditions['config'] = config;
        return conditions;
    }

    _getOutConditionType(data: any, config: string): any {
        const conditionTypes = this._getConditionTypes('out', config);
        if (!conditionTypes) { return; }

        this._outConditionConfig.setCondition(data);

        const name = `OutCondition-[${this._widgetModel.title}::${this._widgetModel.widgetId}::${config}()]`;
        let outConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        // get ConditionType array
        this._outConditionConfig.initModel(this._widgetModel.properties);
        const outConditionTypes = outConditionGroup.getConditions(this._outConditionConfig, true);

        outConditionGroup.clear();
        outConditionGroup = null;

        return outConditionTypes;
    }

    /**
     * Tooltip 에서 sync 요청을 받으면 sync action을 수행한다.
     */
    syncOutCondition(rawCondition: any) {
        let condition = new CommonCondition(rawCondition, rawCondition['config']);
        this._sendOutCondition(condition);
    }

    _sendOutCondition(condition: CommonCondition) {
        const conditionTypes: ConditionType[] = this._outConditionConfig[condition.config]();
        if (!conditionTypes) { return; }
        this._outConditionConfig.setCondition(condition.data);

        const name = `OutCondition-[${this._widgetModel.title}::${this._widgetModel.widgetId}::${condition.config}()]`;
        let outConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        if (!outConditionGroup.isValid(this._outConditionConfig)) {
            this.warn(name, 'Invalidation. Please check your required in condition dictionary ');
            // TODO: show invalid out-condition data
            // notify
            return;
        }

        // this._outConditionConfig.initModel(this._widgetModel.properties);
        // const conditions = outConditionGroup.getConditions(this._outConditionConfig);
        this._sendOutConditionToWidgets(condition.data);

        // move to synced widget based on min y
        this._moveSyncWidget();

        outConditionGroup.clear();
        outConditionGroup = null;
        // clear sync data
        this._outConditionConfig.clearCondition();
    }

    _sendOutConditionToWidgets(conditions: any) {
        const action: SyncConditionAction = InjectorUtil.getService(SyncConditionAction);

        // widgetId & conditions
        if (this._isEnableSyncOutCondition()) {
            this._widgetModel.properties.communication.widgets.forEach((widgetId: number) => {
                action.syncOutCondition(widgetId, this._widgetModel.title, conditions);
            });
        }
    }

    _moveSyncWidget() {
        let widgetId: number = this._getMinYWidgetId();
        if (widgetId) {
            const pageAction: PageAction = InjectorUtil.getService(PageAction);
            setTimeout(() => {
                pageAction.moveWidgetOnDashboard(this._widgetModel.dashboardId, widgetId);
            }, 50);
        }
    }

    _getMinYWidgetId() {
        if (!this._widgetModel.properties.communication
            || !this._widgetModel.properties.communication.widgets
            || this._widgetModel.properties.communication.widgets.length === 0) {
            return;
        }

        if (this._widgetModel.properties.communication.widgets.length === 1) {
            return this._widgetModel.properties.communication.widgets[0];
        } else {
            const stateManager: StateManager = InjectorUtil.getService(StateManager);
            const widgets = stateManager.getWidgets(this._widgetModel.dashboardId);
            let comWidgets: any[] = [];
            this._widgetModel.properties.communication.widgets.forEach((widgetId: number) => {
                widgets.forEach((widget) => {
                    if (widget.widgetId === widgetId) {
                        comWidgets.push(widget);
                    }
                });
            });
            const widget = _.min(comWidgets, (widget) => widget.y);
            return widget.widgetId;
        }
    }

    _isEnableSyncOutCondition() {
        return this._widgetModel.properties.communication
            && this._widgetModel.properties.communication.widgets
            && this._widgetModel.properties.communication.widgets.length > 0;
    }

    _isDisableSyncOutCondition() {
        return !this._widgetModel.properties.communication
            || !this._widgetModel.properties.communication.widgets
            || this._widgetModel.properties.communication.widgets.length <= 0;
    }


    /************************************************************************
     *
     * IN CONDITION
     *
     * call from widget-container.ts when create widget, setup widget.module
     *
     ************************************************************************/
    setInConditionConfig(inConditionConfig: ConditionApi) {
        this._inConditionConfig = inConditionConfig;
    }

    _getInCondition(data: any): any {
        if (!this._inConditionConfig) {
            this.warn(`You don't have In-Condition ${this._widgetModel.widgetId} because you received Out-Condition`);
            return;
        }

        this._inConditionConfig.initModel(this._widgetModel.properties);
        this._inConditionConfig.setCondition(data);

        const conditionTypes = this._getConditionTypes('in', 'config');
        if (!conditionTypes) { return; }

        const name = `InCondition-[${this._widgetModel.title}::${this._widgetModel.widgetId}::config()]`;
        let inConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        if (!inConditionGroup.isValid(this._inConditionConfig)) {
            this.warn(name, 'Invalidation. Please check your required in condition dictionary');
            // TODO: show invalid out-condition data
            // notify
            return;
        }

        const conditions = inConditionGroup.getConditions(this._inConditionConfig);
        inConditionGroup.clear();
        inConditionGroup = null;

        return conditions;
    }

    _getConditionTypes(type: string, config: string): any {
        let conditionTypes: ConditionType[];
        try {
            if (type === 'in') {
                conditionTypes = this._inConditionConfig[config]();
            } else if (type === 'out') {
                conditionTypes = this._outConditionConfig[config]();
            }
        } catch (e) {
            this.warn('There is no in-condition config() method');
            return;
        }
        return conditionTypes;
    }


    /************************************************************************
     *
     * Chart
     *
     ************************************************************************/
    setChart(evt: any) {
        this.charts.push(evt);
        // this.resize = {
        //     isResize: true
        // };
    }

    /**
     * 위젯의 초기 크기를 전달해준다.
     * 20, 50은 헤더와 마진을 제외한 값
     */
    getInitSize() {
        if (this._widgetBodyEl) {
            return {
                width: this._widgetBodyEl.nativeElement.clientWidth - 20,
                height: this._widgetBodyEl.nativeElement.clientHeight - 50
            };
        }
        // default
        return {
            width: 100,
            height: 100
        };
    }


    /************************************************************************
     *
     * Display Configuaration
     *
     ************************************************************************/
    displayConfiguaration(isSynced: boolean = false) {
        this._isSynced = isSynced;
        if (isSynced) {
            let configInfo = this.getViewData('displaySync', isSynced, true);
            this.configuarationInfo = configInfo;
        } else {
            let configInfo = this.getViewData('displayConfiguration', isSynced, true);
            this.configuarationInfo = configInfo;
        }
    }


    /************************************************************************
     *
     * Spinner
     *
     ************************************************************************/
    showSpinner(message: string = null) {
        this._widgetContainerNotifier.next({ type: SPINNER.INIT, data: { message } });
    }

    showNoData(message: string = null) {
        this._widgetContainerNotifier.next({ type: SPINNER.NODATA, data: { message } });
    }

    showError(message: string = null) {
        this._widgetContainerNotifier.next({ type: SPINNER.ERROR, data: { message } });
    }

    // TODO : isForce 삭제예정
    hideSpinner(isForce?: boolean) {
        this._widgetContainerNotifier.next({ type: SPINNER.NONE });
    }


    /************************************************************************
     *
     * Util
     *
     * Properties get/set, Spinner, log
     *
     ************************************************************************/
    setProp(key: string, value?: any) {
        this._widgetModel.properties[key] = value;
        this._createPropertiesGroup();
    }

    getProp(name: string) {
        return this._widgetModel.properties[name];
    }

    setStateProp(key: string, value?: any) {
        this._widgetModel.stateProperties[key] = value;

        let stateProperties = JSON.stringify(this._widgetModel.stateProperties);
        Util.Data.setCookie(`widget-${this._widgetModel.widgetId}`, stateProperties);
    }

    getPropInt(name: string) {
        return parseInt(this.getProp(name), 10);
    }

    isEmpty(value: any): boolean {
        return value === undefined || value === null;
    }

    toggleWidgetSetup() {
        this._widgetContainerNotifier.next({ type: A3_WIDGET.TOOGLE_SLIDING_SETUP });
    }

    disableConfigurationBtn(isDisable: boolean = true) {
        this._widgetContainerNotifier.next({ type: 'DISABLE_CONFIG', data: isDisable });
    }


    /**
     * Logging util
     * TODO: production mode or config . show / hide log
     */
    log(...args: any[]) {
        // console.log.apply(this, args);
    }

    /**
     * first param : i18n Key
     * second param: params object for injecting values
     */
    info(...args: any[]) {
        if (args && args.length === 1) {
            this._notify.info(args[0]);
        } else if (args && args.length === 2) {
            this._notify.info(args[0], args[1]);
        }
        // console.log.apply(this, args);
    }

    success(...args: any[]) {
        if (args && args.length === 1) {
            this._notify.success(args[0]);
        } else if (args && args.length === 2) {
            this._notify.success(args[0], args[1]);
        }
        // console.log.apply(this, args);
    }

    error(...args: any[]) {
        if (args && args.length === 1) {
            this._notify.error(args[0]);
        } else if (args && args.length === 2) {
            this._notify.error(args[0], args[1]);
        }
        // console.error.apply(this, args);
    }

    warn(...args: any[]) {
        if (args && args.length === 1) {
            this._notify.warn(args[0]);
        } else if (args && args.length === 2) {
            this._notify.warn(args[0], args[1]);
        }
        // console.warn.apply(this, args);
    }


    destroy() {
        if (this._propertiesGroup) {
            this._propertiesGroup.clear();
        }

        if (this._widgetApiSubscription) {
            this._widgetApiSubscription.unsubscribe();
        }

        if (this._windowReszieSubscription) {
            this._windowReszieSubscription.unsubscribe();
        }

        if (this._linkSubscription) {
            this._linkSubscription.unsubscribe();
        }
    }


}
