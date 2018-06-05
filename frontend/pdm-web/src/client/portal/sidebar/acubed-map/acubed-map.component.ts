import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';


import {
    VisMapComponent,
    ContextMenuType,
    InjectorUtil,
    NotifyService,
    ContextMenuService
} from '../../../sdk';

import {
    RequestType,
    ContextMenuModel,
    ContextMenuAction,
    ContextMenuRequester,
    ContextMenuTemplateInfo,
    ModalAction,
    ModalRequester,
    CurrentModel,
    StateManager,
    SessionService
} from '../../../common';

import { AcubedMapSharedUserComponent } from "./shared-user/acubed-map-shared-user.component";
import { AcubedMapGridComponent } from "./grid/acubed-map-grid.component";
import { AcubedMapService } from "./acubed-map.service";
import { SidebarService } from '../sidebar.service';
import { RouterService } from '../../router/router.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'a3p-acubed-map, div[a3p-acubed-map]',
    templateUrl: 'acubed-map.html',
    providers: [AcubedMapService],
    host: {
        'class': 'height-full'
    }
})
export class AcubedMapComponent implements OnInit, OnDestroy {
    @ViewChild('visMap') visMapEl: VisMapComponent;
    @ViewChild('sharedUser') sharedUserEl: AcubedMapSharedUserComponent;
    @ViewChild('managingWorkspaces') gridEl: AcubedMapGridComponent;

    // use Context Menu
    private _contextMenuAction: ContextMenuAction = InjectorUtil.getService(ContextMenuAction);
    private _contextRequester = new Subject<RequestType>();
    private _contextRequesterObservable$ = this._contextRequester.asObservable();
    private _contextSubscription: Subscription;

    private _currentSubscription: Subscription;
    private _isDestroy: boolean;

    homeType: any;
    main: any;

    acubedmapChart: any;
    response: any;
    config: any;
    data: any;
    filterText: string;
    tooltip: any = {};
    selectedUserInfo: any;
    sliderAttr: any = {
        min: 30,
        max: 100,
        step: 10,
        value: 30
    };
    selectedCount: number = this.sliderAttr.min;
    onSliderValue: number = this.sliderAttr.min;

    constructor(
        private service: AcubedMapService,
        private session: SessionService,
        private router: RouterService,
        private sidebar: SidebarService,
        private modalAction: ModalAction,
        private modalRequester: ModalRequester,
        private stateManager: StateManager,
        private notify: NotifyService,
        private contextMenuService: ContextMenuService
    ) {}

    ngOnInit() {
        this.selectedUserInfo = this.session.getUserInfo();
        this._listenContextMenu();
        this._setCurrentState();
        setTimeout(() => {
            if (!this._isDestroy) {
                this._getData();
            }
        }, 1000);
    }

    private _listenContextMenu() {
        this._contextSubscription = this._contextRequesterObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === A3_CONFIG.TOOLTIP.REQUESTER.DELETE_WORKSPACE) {
                    this.deleteWorkspace(request.data);
                }
                else if (request.type === A3_CONFIG.TOOLTIP.REQUESTER.SHARE_WORKSPACE) {
                    this.shareWorkspace(request.data);
                }
                else if (request.type === A3_CONFIG.TOOLTIP.REQUESTER.GO_TASKER) {
                    this.goTasker(request.data);
                }
                else if (request.type === A3_CONFIG.TOOLTIP.REQUESTER.SCHEDULE_TASKER) {
                    this.scheduleTasker(request.data);
                }
                else if (request.type === A3_CONFIG.TOOLTIP.REQUESTER.DELETE_TASKER) {
                    this.deleteTasker(request.data);
                }
                // closeContextMenu
                this._contextMenuAction.closeContextMenu(0);
            }
        );
    }

    private _setCurrentState() {
        const current$ = this.stateManager.rxCurrent();
        this._currentSubscription = current$.subscribe((current: CurrentModel) => {
            // set dashboard, workspace when change dashboard, workspace
            if (current.homeType === ActionType.DASHBOARD) {
                this.main = this.stateManager.getDashboard();
            } else if (current.homeType === ActionType.WORKSPACE) {
                this.main = this.stateManager.getWorkspace();
            }
            this.homeType = current.homeType;
        });
    }

    private _getData(type: string = '') {
        this.sidebar.showSpinner();
        let promise: Promise<any>;
        let filter = {
            includeSharedUserMap: true,
            workspacesCount: this.selectedCount
        };
        if (this.homeType === ActionType.WORKSPACE && type === '') {
            promise = this.service.getTaskerWorkspacemap(this.main.workspaceId);
        } else {
            promise = this.service.getWorkspacemap(this.selectedUserInfo.userId, filter, type);
        }
        promise.then(
            (response: any) => {
                this.config = this._getConfig();
                this.data = this.service.getVisMapData(response);
                this.visMapEl.setConfig(this.config);
                this.visMapEl.loadData(this.data);
            }, (response: any) => {
                if (this.visMapEl.chart) this.visMapEl.chart.clear();
                this.sidebar.showError();
            }
        );
    }

    private _getConfig() {
        let event = {
            click: {enable:true, callback: this.callbackVisMapClick, api: this},
            hoverNode: {enable: true, api: this},
            afterDrawing: {enable: true, callback: this.callbackVisMapDrawingComplate, api: this}
        };
        return {
            data: [],
            userImagePath: this.selectedUserInfo.userImgPath,
            mapConfig: this.service.getVisMapConfig(),
            mapStyle: this.service.getVisMapStyle(),
            event: event
        };
    }

    setChart(instance: any) {
        this.acubedmapChart = instance;
    }

    callbackVisMapClick(event: any) {
        // TODO : this 접근 방법 개선
        this['api'].toggleTooltip(true, event);
        this['api'].toggleAutomation(false);
        this['api'].toggleSharedUser(false);
    }

    callbackVisMapDrawingComplate(canvas: any) {
        this['api'].sidebar.hideSpinner();
    }

    toggleTooltip(isToggle: boolean, event: any = null) {
        if (isToggle && event && event.data.nodeType !== 'U') {
            let contextType: ContextMenuType = {
                tooltip: this.service.getTooltipOption(event),
                template: {
                    data: event.data,
                    type: ContextMenuTemplateInfo.ACUBED_MAP
                }
            };
            let contextModel: ContextMenuModel = {
                id: 0,
                tooltip: contextType.tooltip,
                template: contextType.template,
                requester: new ContextMenuRequester(this._contextRequester, contextType)
            };
            this._contextMenuAction.showContextMenu(contextModel);
        }
        else {
            this._contextMenuAction.closeContextMenu(0);
        }
    }

    toggleAutomation(isOpen: boolean, data: any = null) {
        // TODO
    }

    toggleSharedUser(isOpen: boolean) {
        isOpen ? this.sharedUserEl.init() : this.sharedUserEl.close();
    }

    changeFilterText() {
        this.visMapEl.chart.filterData(this.filterText);
    }

    deleteWorkspace(selectedData: any) {
        this.modalAction.showConfirmDelete({
            info: {
                confirmMessage: 'MESSAGE.ACUBED_MAP.MAP.REMOVE_WORKSPACE',
                info: {
                    workspaceId: selectedData.workspaceId
                }
            },
            requester: this.modalRequester
        });
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('deleteWorkspace ok', response.data);
                this.service.deleteWorkspace(response.data.info.workspaceId).then(
                    (response: any) => {
                        this._getData();
                        this.notify.success("MESSAGE.GENERAL.REMOVED_WORKSPACE");
                    }
                );
            }
        });
    }

    shareWorkspace(selectedData: any) {
        this.modalAction.showShare({
            info: {
                type: A3_CONFIG.MODAL.TYPE.SHARE_WORKSPACE,
                id: selectedData.workspaceId,
                name: selectedData.label
            },
            requester: this.modalRequester
        });
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('shareWorkspace response', response);
                console.log('shareWorkspace ok', response.data);
            }
        });
    }

    goTasker(selectedData: any) {
        this.router.goWorkspace(selectedData.workspaceId, selectedData.taskerId, window.open('', '_blank'));
    }

    scheduleTasker(selectedData: any) {

    }

    deleteTasker(selectedData: any) {
        this.modalAction.showConfirmDelete({
            info: {
                confirmMessage: 'MESSAGE.ACUBED_MAP.MAP.REMOVE_TASKER',
                info: {
                    workspaceId: selectedData.workspaceId,
                    taskerId: selectedData.taskerId
                }
            },
            requester: this.modalRequester
        });
        this.modalRequester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                console.log('deleteTasker ok', response.data);
                this.service.deleteTasker(response.data.info.workspaceId, response.data.info.taskerId).then(
                    (response: any) => {
                        this._getData();
                        this.notify.success("MESSAGE.GENERAL.REMOVED_TASKER");
                    }
                );
            }
        });
    }

    changeGridView() {
        this.gridEl.init();
    }

    changeUser(data: any, type: string = '') {
        if (this.session.getUserId() === data.userId) {
            this.selectedUserInfo = data;
            this._getData();
        }
        else if (this.selectedUserInfo.userId != data.userId) {
            this.selectedUserInfo = data;
            this._getData(type);
        }
    }

    myWorkSpace() {
        this.selectedUserInfo = this.session.getUserInfo();
        this._getData();
    }

    showSliderTooltip(event: any) {
        if (event.type === 'mouseover' || event.type === 'pointermove') {
            let config: any = {
                type: A3_CONFIG.TOOLTIP.TYPE.PLAIN,
                event: event,
                options: {
                    content: `count : ${this.onSliderValue}`,
                    position: {
                        my: 'bottom center'
                    }
                }
            };
            this.contextMenuService.openTooltip(config);
        } else {
            this.contextMenuService.closeTooltip();
        }
    }

    changeCount(count: number) {
        this.selectedCount = count;
        this.visMapEl.chart.clear();
        this._getData();
    }

    updateCount(count: number) {
        this.onSliderValue = count;
        // this.contextMenuService.closeTooltip();
        // this.showSliderTooltip(event);
    }

    destroy() {
        if (this._contextSubscription) {
            this._contextSubscription.unsubscribe();
        }
        if (this._currentSubscription) {
            this._currentSubscription.unsubscribe();
        }
        if (this.visMapEl) {
            this.visMapEl.destroy();
        }
        this._isDestroy = true;

    }

    ngOnDestroy() {
        console.log('acubed-map destroy');
        this.destroy();
    }
}
