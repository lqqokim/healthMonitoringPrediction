import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { TaskerModel } from '../app-state/workspace/workspace.type';
import { ContextMenuAction } from '../app-state/context-menu/context-menu.action';
import { ContextMenuModel } from '../app-state/context-menu/context-menu.type';
import { ContextMenuRequester } from '../popup/context-menu/context-menu-requester';
import { ConditionBuilder } from '../condition/builder/condition-builder';
import { ConditionType } from '../condition/condition.type';
import { ConditionApi } from '../condition/condition.api';
import { TaskerRefreshType } from './tasker.type';
import { RequestType } from '../types/common.type';

import { ModalApi } from '../popup/modal/modal.api';

import {
    InjectorUtil,
    ContextMenuType,
    // ContextMenuActionType,
    ContextMenuService,
    Util,
    NotifyService
} from '../../sdk';
import {
    ContextMenuTemplateInfo,
    ViewApi
} from '../../common';

export abstract class TaskerApi extends ModalApi {

    protected charts: any = [];
    protected resize: any = {};

    private _taskerModel: TaskerModel;
    private _taskerBodyEl: ElementRef;
    private _containerElement: any;

    private _taskerApiSubscription: Subscription;
    private _taskerContainerNotifier: Subject<RequestType>;

    // TODO 향후 tasker config가 생기면 사용가능
    // private _propertiesConfig: ConditionApi | any;
    // private _propertiesGroup: ConditionGroup;

    private _inConditionConfig: ConditionApi | any;
    private _outConditionConfig: ConditionApi | any;

    private _viewConfig: ViewApi | any;

    // use Context Menu
    private _taskerApiRequesterSubscription: Subscription;
    private _taskerApiRequester = new Subject<RequestType>();
    private _taskerApiRequesterObservable$ = this._taskerApiRequester.asObservable();
    private _openContextUid: string;
    private _openContextEventType: string;
    private _debounceShowContextMenu = _.debounce(this._showContextMenu, 300);

    // for resize
    private DEBOUNCE_TIME: number = 100;
    // private _resizeNotify = new Subject<any>();
    // private _resizeObservable$ = this._resizeNotify.asObservable();
    private _windowReszieSubscription: Subscription;

    private _uuid: any;
    private _notify: NotifyService;

    constructor() {
        super();
        this._uuid = `tasker-${Util.UUID.new()}`;
        this._listenInternal();
        this._notify = InjectorUtil.getService(NotifyService);
    }

    /**
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *   - justRefresh : click button을 눌렀을 경우. 다시 properties를 참조해서 refresh 한다. Sync되었던 InCondition은 무시된다.
     *   - applyConfig : widget configuration을 새롬게 설정했을 경우. 새로운 properties를 가져와 refresh 한다.
     *   - syncInCondition : InCondition 이 왔을 경우. Condition validation 후에 refresh 한다.
     */
    abstract refresh(type?: TaskerRefreshType): void;

    /**
     * Widget 내부에서 요청되는 것만을 처리한다.
     */
    _listenInternal() {
        // 위젯 자체 안에서 요청만을 리스닝처리한다.
        this._taskerApiRequesterSubscription = this._taskerApiRequesterObservable$.subscribe(
            (request: RequestType) => {
                // at first, close context-menu
                this.closeContextMenu();

                if (request.type === A3_TASKER.SYNC_OUTCONDITION_REQUEST) {
                    // TODO
                    // this._sendOutCondition(request.data);
                }
                if (request.type === A3_TASKER.SYNC_TRANS_CALLBACK_REQUEST) {
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                }
                else if (request.type === A3_TASKER.SHOW_APP_LIST) {
                   this._taskerContainerNotifier.next(request);
                }
                else if (request.type === A3_WIDGET.SHOW_DETAIL_VIEW) {
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                }
                else if (request.type === A3_WIDGET.DESTROY_CONTEXT_REQUEST) {
                    this.closeContextMenu();
                }
                else if (request.type === A3_TASKER.INTERNAL_ACTION) {
                    // 컨텍스트 메뉴의 Dispaly영역에 버튼을 클릭 했을 경우.
                    // InternalActionType을 등록한다.
                    // InternalActionType 형태로 보내면 data안에 callback을 체크해서 호출해준다.
                    // @see context-menu.type.ts
                    if (request.data['callback']) {
                        request.data['callback'].call(this, request.data['data']);
                    }
                }
                else if (request.type === A3_TASKER.ADD_COMMENT) {
                    // TODO in the future
                }
                else if (request.type === A3_TASKER.CONTEXT_TICK_CLICK) {
                    let cm: ContextMenuModel = request.data.contextMenuModel;
                    cm.tooltip.eventType = A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK;
                    this.showContextMenu(cm);
                    // console.log(request);
                    // TODO in the future
                }
            },
            this._handleError
        );
    }

    /**
     * 대시보드 전체, 즉, 애플리케이션 레밸의 요청에대해 처리한다.
     */
    listenContainer(taskerApiObservable$: Observable<RequestType>, taskerContainerNotifier: Subject<RequestType>) {
        // setup notifier to tasker-container
        this._taskerContainerNotifier = taskerContainerNotifier;
        // listen it from tasker-container or context-menu
        this._taskerApiSubscription = taskerApiObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === A3_TASKER.JUST_REFRESH) {
                    request.data = this.getProperties();
                    this.refresh(request);
                }
                else if (request.type === A3_TASKER.APPLY_CONFIG_REFRESH) {
                    // TODO in the future if tasker has configuration.
                    // let taskerModel: TaskerModel = request.data;
                    // this._createPropertiesGroup();
                    // request.data = this.getProperties();
                    // this.refresh(request);
                }
                else if (request.type === A3_TASKER.SYNC_INCONDITION_REFRESH) {
                    // Checking Validation
                    const mappedData = this._getInCondition(request.data);
                    if (mappedData) {
                        request.data = mappedData;
                        this.refresh(request);
                    } else {
                        // TODO
                        // notify
                    }
                }
                else if (request.type == A3_TASKER.UPDATE_TASKER) {
                    this._taskerModel = request.data;
                }
                else if (request.type == A3_TASKER.REMOVE_TASKER) {
                    this.destroy();
                }
            },
            this._handleError
        );
    }

    _handleError(e: any) {
        console.log('Tasker API, Exception', e);
    }

    setInfo(taskerModel: TaskerModel, taskerBodyEl: ElementRef, containerElement: any) {
        this._taskerModel = taskerModel;
        this._taskerBodyEl = taskerBodyEl;
        this._containerElement = containerElement;
        this.log('--- tasker name', this._taskerModel.title, ', Id', this._taskerModel.taskerId);
        this._transformModel();
    }

    _transformModel() {
        if (this._taskerModel && !this._taskerModel.conditions) { return; }

        let conditions: any = {};
        this._taskerModel.conditions.forEach((prop) => {
            conditions[prop.key] = prop.value;
        });

        this._taskerModel.originConditions = Util.Data.mergeDeep({}, this._taskerModel.conditions);
        this._taskerModel.conditions = conditions;
    }

    get taskerModel() {
        return this._taskerModel;
    }

    get requester() {
        return this._taskerApiRequester;
    }

    /**
    * When resize wiget container, trigger window resize event
    * Not Used
    */
    enableWindowResizeTrigger() {
        if (!this._containerElement) { return; }

        // Duplicated
        // new ResizeSensor(this._containerElement, () => {
        //     this._resizeNotify.next(`resize:tasker-container:${this.taskerModel.taskerId}`);
        // });

        // // enable subscribe
        // this._windowReszieSubscription = this._resizeObservable$
        //     .debounce((x: any) => Observable.timer(this.DEBOUNCE_TIME))
        //     .subscribe((req: any) => {
        //         // console.log(`tasker _setTriggerWindowReszie ==> ${this.taskerModel.taskerId}`);
        //         var evt = window.document.createEvent('UIEvents');
        //         evt.initUIEvent('resize', true, false, window, 0);
        //         window.dispatchEvent(evt);
        //     });

        let lazyLayout = _.debounce(() => {
            // console.log(`_setTriggerWindowReszie ==> ${this.widgetModel.widgetId}`);
            const evt = window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }, this.DEBOUNCE_TIME);

        $(this._containerElement).resize(lazyLayout);
    }

    /************************************************************************
     *
     * CONTEXT MENU
     *
     * 1) 위젯의 차트들은 템플릿 종류와 템플릿 매핑 데이터 그리고 컨디션 데이터를 준다.
     * 2) TaskerApi 는 컨텍스트 메뉴를 띄워준다.
     *    (Sync를 할 수 있는 위젯인지 아닌지 판단한다)
     *
     ************************************************************************/

    showContextMenu(cm: ContextMenuType) {
        // TODO : underscore.debounce -> Observable.debounce
        if (this._isClickEvent(cm)) {
            this._showContextMenu(cm);
        }
        else if (this._isValidOverContext(cm)) {
            this._debounceShowContextMenu(cm);
        }
    }

    _showContextMenu(cm: ContextMenuType) {
        // console.log('::::::::::::::::::::: _showContextMenu : ', this._isValidOverContext(cm));
        // 열려있는 context 체크
        // if (!this._isValidOverContext(cm)) return;
        // showContextMenu
        if (this._isValidContext(cm)) {
            this._initContextMenuType(cm);
            this._outConditionConfig.clearCondition();
            const contextMenu: ContextMenuModel = {
                id: this._taskerModel.taskerId,
                tooltip: cm.tooltip,
                template: cm.template,
                outCondition: cm.outCondition,
                contextMenuAction: cm.contextMenuAction,
                contextMenuOption: cm.contextMenuOption,
                requester: new ContextMenuRequester(this._taskerApiRequester, cm)
            };
            const action: ContextMenuAction = InjectorUtil.getService(ContextMenuAction);
            action.showContextMenu(contextMenu);
        }
    }

    closeOverContextMenu(event: any = null) {
        // console.log('::::::::::::::::::::: closeOverContextMenu');
        let isOverEvent: boolean = this._openContextEventType !== A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK;
        let isTickPosition: boolean = this.isOpenContextMenu() ? Util.Context.isTickPosition(event) : false;
        if (isOverEvent && !isTickPosition) {
            this.closeContextMenu();
        }
    }

    closeContextMenu() {
        // console.log('::::::::::::::::::::: closeContextMenu : ', this.isOpenContextMenu());
        if (this.isOpenContextMenu()) {
            this._openContextUid = null;
            this._openContextEventType = null;
            const action: ContextMenuAction = InjectorUtil.getService(ContextMenuAction);
            action.closeContextMenu(this._taskerModel.taskerId);
        }
    }

    isOpenContextMenu(): boolean {
        return Util.Data.isNotNull(this._openContextUid);
    }

    isOpenOverContextMenu(): boolean {
        return (this._openContextUid && this._openContextEventType === A3_CONFIG.TOOLTIP.EVENT_TYPE.OVER)
    }

    _isValidContext(cm: ContextMenuType) {
        // over event && current element is hover
        if (!this._isClickEvent(cm)
            && cm.tooltip.event
            && !$(cm.tooltip.event.target).is(":hover")) {
            return false;
        }
        else if (this._isClickEvent(cm)
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
            && this._openContextUid === cm.tooltip.uid ) {
            return false;
        }
        return true;
    }

    _initContextMenuType(cm: ContextMenuType) {
        this._openContextUid = Util.Data.nvl(cm.tooltip.uid, Util.UUID.new());
        this._openContextEventType = this._isClickEvent(cm) ? A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK : A3_CONFIG.TOOLTIP.EVENT_TYPE.OVER;

        cm.tooltip.eventType = this._openContextEventType;//cm.tooltip.eventType || A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK;
        cm.tooltip.options = this._getTooltipOptions(cm);
        cm.tooltip.type = A3_CONFIG.TOOLTIP.TYPE.CHART;
        cm.template.type = cm.template.type || ContextMenuTemplateInfo.WIDGET_COMMON;
        cm.template.title = cm.template.title || this._taskerModel.title;
        cm.template.data = this._getTemplateData(cm);
        cm.outCondition = cm.outCondition || {data: {}};
        cm.contextMenuAction = this._makeContextMenuAction(cm);
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
        if (ContextMenuTemplateInfo.isViewDataTemplate(cm.template.type)) {
            return this.getViewData(cm.template.data['config'], cm.template.data);
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
        if (eventType) {
            return eventType === A3_CONFIG.TOOLTIP.EVENT_TYPE.CLICK;
        }
        else if (event && event.type !== 'click') {
            return false;
        }
        return true;
    }

    _getContextMenuAction(cm: ContextMenuType) {
        return {
            invisible: !this._isClickEvent(cm),
            disableCommnet: true,
            invisibleComment: false,
            disableAppList: false,
            invisibleAppList: false,
            disableDetailView: true,
            invisibleDetailView: false,
            disableSync: true,
            invisibleSync: false
        };
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

    getViewData(config: string, data: any = null) {
        if (!this._viewConfig) {
            this.warn(`You don't have View Config ${this._taskerModel.taskerId}. Please setup View Config in your module.ts`);
            return;
        }

        this._viewConfig.initModel(this._taskerModel.conditions);
        if (data) {
            // set context-menu data
            this._viewConfig.setViewData(data);
        } else {
            // clear context-menu data
            this._viewConfig.setViewData(undefined);
        }

        const viewConfigTypes = this._viewConfig[config]();
        const name = `ViewConfig-[${this._taskerModel.title}::${this._taskerModel.taskerId}::${config}()]`;
        if (!viewConfigTypes) { return; }

        let useApi: any = this._viewConfig;
        let isConditionType: boolean = data ? true : false;
        let viewConfigGroup = ConditionBuilder.createConditionGroup(viewConfigTypes, name);
        let views: any = viewConfigGroup.getConditions(useApi, isConditionType);

        viewConfigGroup.clear();
        viewConfigGroup = null;

        // must set config
        // @see use it config properties in showContextMenu
        views['config'] = config;
        return views;
    }

    openTooltip(config: any){
        const menu: ContextMenuService = InjectorUtil.getService(ContextMenuService);
        menu.openTooltip(config);
    }

    /************************************************************************
     *
     * PROPERTIES
     *
     * call from widget-container.ts when create widget, setup widget.module
     *
     ************************************************************************/
    // setPropertiesConfig(propertiesApi: ConditionApi): Promise<any> {
    //     this._propertiesConfig = propertiesApi;
    //     this._createPropertiesGroup();
    //     // last init
    //     return this._propertiesConfig.initModel(this._taskerModel.conditions, true);
    // }

    /**
     * 향후 tassker configuration이 생기면 widget->tasker, tasker->tasker로 넘어온 condition과
     * properties는 구분되어여 함
     */
    getProperties() {
        return this._taskerModel.conditions;
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
     * 태스커에서 호출한 후 데이터를 설정한다.
     */
    getOutCondition(config: string) {
        if (!this._outConditionConfig) {
            this.warn(`You don't have Out-Condition ${this._taskerModel.taskerId}. Please setup Out-Condition in your module.ts`);
            return;
        }

        const conditionTypes = this._getConditionTypes('out', config);
        if (!conditionTypes) { return; }

        const name = `OutCondition-[${this._taskerModel.title}::${this._taskerModel.taskerId}::${config}()]`;
        let outConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        this._outConditionConfig.initModel(this._taskerModel.conditions);
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

        const name = `OutCondition-[${this._taskerModel.title}::${this._taskerModel.taskerId}::${config}()]`;
        let outConditionGroup = ConditionBuilder.createConditionGroup(conditionTypes, name);
        // get ConditionType array
        this._outConditionConfig.initModel(this._taskerModel.conditions);
        const outConditionTypes = outConditionGroup.getConditions(this._outConditionConfig, true);

        outConditionGroup.clear();
        outConditionGroup = null;

        return outConditionTypes;
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

    _getInCondition(rawCondition: any): any {
        if (!this._inConditionConfig) {
            this.warn(`You don't have In-Condition ${this._taskerModel.taskerId} because you received Out-Condition`);
            return;
        }

        this._inConditionConfig.initModel(this._taskerModel.conditions);
        this._inConditionConfig.setCondition(rawCondition.data);

        const conditionTypes = this._getConditionTypes('in', 'config');
        if (!conditionTypes) { return; }

        const name = `InCondition-[${this._taskerModel.title}::${this._taskerModel.taskerId}::config()]`;
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
        if (this._taskerBodyEl) {
            return {
                width: this._taskerBodyEl.nativeElement.clientWidth - 20,
                height: this._taskerBodyEl.nativeElement.clientHeight - 50
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
     * Spinner
     *
     ************************************************************************/
    showSpinner(message: string = null) {
        this._taskerContainerNotifier.next({ type: SPINNER.INIT, data: {message} });
    }

    showNoData(message: string = null) {
        this._taskerContainerNotifier.next({ type: SPINNER.NODATA, data: {message} });
    }

    showError(message: string = null) {
        this._taskerContainerNotifier.next({ type: SPINNER.ERROR, data: {message} });
    }

    hideSpinner() {
        this._taskerContainerNotifier.next({ type: SPINNER.NONE });
    }

    /************************************************************************
     *
     * Util
     *
     * Properties get/set, Spinner, log
     *
     ************************************************************************/
    setProp(key: string, value?: any) {
        this._taskerModel.conditions[<any>key] = value;

        // this._createPropertiesGroup();
    }

    getProp(name: string) {
        return this._taskerModel.conditions[<any>name];
    }

    getPropInt(name: string) {
        return parseInt(this.getProp(name), 10);
    }

    isEmpty(value: any): boolean {
        return value === undefined || value === null;
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
        console.error.apply(this, args);
    }

    warn(...args: any[]) {
        if (args && args.length === 1) {
            this._notify.warn(args[0]);
        } else if (args && args.length === 2) {
            this._notify.warn(args[0], args[1]);
        }
        console.warn.apply(this, args);
    }

    destroy() {
        if (this._taskerApiRequesterSubscription) {
            this._taskerApiRequesterSubscription.unsubscribe();
        }

        if (this._taskerApiSubscription) {
            this._taskerApiSubscription.unsubscribe();
        }

        if (this._windowReszieSubscription) {
            this._windowReszieSubscription.unsubscribe();
        }
    }

}
