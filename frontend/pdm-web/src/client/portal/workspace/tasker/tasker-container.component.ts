import {
    Component,
    Input,
    OnInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
    ElementRef,
    ComponentRef
} from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
    TaskerModel,
    RequestType,
    SidebarAction,
    CommunicationAction,
    ContextMenuAction,
    StateManager,
    ScrollEventService
} from '../../../common';

import {
    SpinnerComponent
} from '../../../sdk';

import { TaskerContainerService } from './tasker-container.service';
import { RouterService } from '../../router/router.service';

@Component({
    moduleId: module.id,
    selector: 'div[a3p-tasker-container]',
    templateUrl: 'tasker-container.html'
})
export class TaskerContainerComponent implements OnInit, OnDestroy, OnChanges {

    @Input() taskerModel: TaskerModel;
    parentType: any;
    isBlur: boolean;

    private _taskerComponent: ComponentRef<any>;
    // for tasker
    private _taskerApiNotifier = new Subject<RequestType>();
    private _taskerApiObservable$ = this._taskerApiNotifier.asObservable();
    private _taskerContainerNotifier = new Subject<RequestType>();
    private _taskerContainerObservable$ = this._taskerContainerNotifier.asObservable();

    private _taskerContainerSubscription: Subscription;
    private _lastTaskerModel: any;
    private _scrollSubscription: Subscription;

    @ViewChild('taskerGenerator', { read: ViewContainerRef }) taskerGeneratorEl: ViewContainerRef;
    @ViewChild('taskerBody') taskerBodyEl: ElementRef;
    @ViewChild('spinner') spinner: SpinnerComponent;

    constructor(
        private taskerContainer: TaskerContainerService,
        private router: RouterService,
        private container: ViewContainerRef,
        private sidebarAction: SidebarAction,
        private communicationAction: CommunicationAction,
        private contextMenuAction: ContextMenuAction,
        private stateManager: StateManager,
        private scrollEventService: ScrollEventService
    ) { }

    ngOnInit() {
        // console.log('------TaskerContainerComponent init');
        this._listenTaskerApi();
        this.isBlur = true;
    }

    /**
     * workspace.component.html 에서 받음
     */
    ngOnChanges(changes: SimpleChanges) {
        const model = changes['taskerModel'];

        if (model && model.currentValue && !_.isEmpty(model.currentValue)) {
            this.taskerModel = this._lastTaskerModel = model.currentValue;


            this.taskerContainer
                .createTasker(
                    this,
                    this.taskerGeneratorEl,
                    this.taskerBodyEl,
                    this._taskerApiObservable$,
                    this._taskerContainerNotifier,
                    this.container.element.nativeElement
                ).then(
                    (cmp: ComponentRef<any>) => {
                        this._taskerComponent = cmp;
                        this._setScroll();
                    }
                );
        }

        setTimeout(() => {
            if (!this._lastTaskerModel) {
                this.isBlur = false;
                this.spinner.showError('There is no workspace. Please check out workspace & tasker id');
            }
        }, 3000);
    }

    _setScroll() {
        this._unSubscribeScroll();
        this._scrollSubscription = this.scrollEventService.listenScrollEvent(this.taskerBodyEl.nativeElement);
    }

    _listenTaskerApi() {
        this._taskerContainerSubscription = this._taskerContainerObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === A3_WIDGET.SHOW_APP_LIST) {
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
            },
            this._handleError
        );
    }

    _showAppList(request: RequestType) {
        // if (this._isDisabledMenu()) { return; }
        // this._hideTooltip();

        const syncOutCondition = request.data.syncOutCondition || {};
        const appListType = request.data.appListType || undefined;
        this.sidebarAction.openSmall(ActionType.GNB_APP_LIST);
        this.communicationAction.showTaskerAppList(
            this.taskerModel.taskerId,
            syncOutCondition,
            appListType
        );
    }

    _handleError(e: any) {
        console.log('Widget Container Component, Exception', e);
    }

    getEl() {
        return this.container.element.nativeElement;
    }

    goLink() {
        if (!this.parentType) {
            return;
        }

        if (this.parentType.widgetId) {
            this.router.goDashboard(this.parentType.dashboardId);
        } else if (this.parentType.taskerId) {
            this.router.goWorkspace(this.parentType.workspaceId, this.parentType.taskerId);
        }
    }

    toggleProperties() {
        // TODO
        // isOpenProperties = !isOpenProperties;

        // if (_propertiesCallback) {
        //     _propertiesCallback(isOpenProperties);
        // }
    }

    refresh() {
        this._taskerApiNotifier.next({ type: A3_WIDGET.JUST_REFRESH });
    }

    _unSubscribeScroll() {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = undefined;
        }
    }

    ngOnDestroy() {
        if (this._taskerContainerSubscription) {
            this._taskerContainerSubscription.unsubscribe();
        }

        this._unSubscribeScroll();
    }
}
