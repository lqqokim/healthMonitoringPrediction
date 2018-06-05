import {
    Component,
    ChangeDetectorRef,
    ComponentRef,
    ViewChild,
    ViewContainerRef,
    Compiler,
    ComponentFactory,
    OnInit,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import {
    StateManager,
    SidebarAction,
    CommunicationAction,
    SidebarModel
} from '../../common';

import { ChartApi } from '../../sdk';

import { WidgetListModule } from './widget-list/widget-list.module';
import { TaskerListModule } from './tasker-list/tasker-list.module';
import { DashboardListModule } from './dashboard-list/dashboard-list.module';
import { NotificationListModule } from './notification-list/notification-list.module';
import { AcubedMapModule } from './acubed-map/acubed-map.module';

import { SidebarService } from './sidebar.service';


@Component({
    moduleId: module.id,
    selector: 'div.a3p-sidebar',
    templateUrl: 'sidebar.html'
})
export class SidebarComponent implements OnInit, OnDestroy {

    showType: string = '';
    isShowDesc: boolean;
    state: any;
    style: string;
    lastStyle: string;
    gnbTypeId: any;
    title: string;
    sideBar: any = SPINNER.TYPE.SIDE_BAR;
    detailNotification: any;
    private _dynamicComponentRef: ComponentRef<any>;
    private _sidebarSubscription: Subscription;
    private _sidebarInnerSubscription: Subscription;

    @ViewChild('sidebarGenerator', { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('spinner') spinner: ChartApi;
    @ViewChild('sidebarContainer', {read: ElementRef }) sidebarContainer: ElementRef;

    constructor(
        private stateManager: StateManager,
        private sidebarAction: SidebarAction,
        private communicationAction: CommunicationAction,
        private cd: ChangeDetectorRef,
        private compiler: Compiler,
        private sidebar: SidebarService
    ) { }

    ngOnInit() {
        this._setState();
        this._setGlobalHide();
        this._setSidebarComponentListen();
        setTimeout(() => this.hideSpinner());
    }

    private _setGlobalHide() {
        $(document.body).click((e: any) => {
            const state = this.stateManager.getSidebar();

            if ((state.status !== 'hide')
                && !$.contains($('.a3-sidebar-wrapper')[0], e.target)) {
                this.sidebarAction.close();
            }
        });
    }

    private _setState() {
        const sidebar$ = this.stateManager.rxSidebar();

        this._sidebarSubscription = sidebar$.subscribe((sidebarModel: SidebarModel) => {
            this.state = sidebarModel;

            // TODO : 언제 아래 로직을 타는지 모르겠음..
            if (sidebarModel.status === ActionType.CLOSE_SIDE_BAR) {
                this.isShowDesc = false;
            }

            if (sidebarModel.status === 'full') {
                this.style = 'a3-sidebar-full';

                if (sidebarModel.gnbTypeId === ActionType.GNB_ACUBED_NET) {
                    this.style += ' a3-cubenet';
                } else if (sidebarModel.gnbTypeId === ActionType.GNB_ACUBED_MAP) {
                    this.style += ' a3-map-wrapper';
                } else if (sidebarModel.gnbTypeId === ActionType.GNB_NOTICE_LIST) {
                    this.style += ' a3-notification-wrapper';
                }

                // if btn-group select combox is opend, must close all btn-group to open sidebar
                $('div.btn-group').removeClass('open');
                $('div.dropdown').removeClass('open');
            }
            else if (sidebarModel.status === 'small') {
                this.style = 'a3-sidebar-small';

                if (sidebarModel.gnbTypeId === ActionType.GNB_ACUBED_NET) {
                    this.style += ' a3-cubenet';
                } else if (sidebarModel.gnbTypeId === ActionType.GNB_NOTICE_LIST) {
                    this.style += ' a3-notification-wrapper';
                }

                $('div.btn-group').removeClass('open');
                $('div.dropdown').removeClass('open');
            }
            else if (sidebarModel.status === 'hide') {
                this.clearDOM();
                this.style = '';
                this.lastStyle = '';
                this.isShowDesc = false;
                this.detailNotification = undefined;
            }

            // use notification detail about "with-child" class
            // @see _setSidebarComponentListen method
            this.lastStyle = this.style;

            this.gnbTypeId = sidebarModel.gnbTypeId;
            if (sidebarModel.status !== 'hide') {
                this._setSidebar();
            }

            // 주의) [ngClass]="style" forcely change detection
            // 참조) http://stackoverflow.com/questions/35105374/how-to-force-a-components-re-rendering-in-angular-2
            this.cd.detectChanges();
        },
            this._handleError);
    }

    private _handleError(e: any) {
        console.log('Sidebar Component, Exception', e);
    }

    private _setSidebar() {
        // already dom clearing
        this.clearDOM();
        this.showSpinner();

        if (this.gnbTypeId === ActionType.GNB_APP_LIST) {
            this.title = 'Application List';
            this._makeSidebarPanel(TaskerListModule);
        }
        else if (this.gnbTypeId === ActionType.GNB_NOTICE_LIST) {
            this.title = 'Notifications';
             this._makeSidebarPanel(NotificationListModule, true);
        }
        else if (this.gnbTypeId === ActionType.GNB_DASHBOARD_LIST) {
            this.title = 'Dashboard List';
            this._makeSidebarPanel(DashboardListModule);
        }
        else if (this.gnbTypeId === ActionType.GNB_ACUBED_MAP) {
            this.title = 'Acubed Map';
            this._makeSidebarPanel(AcubedMapModule);
        }
        else if (this.gnbTypeId === ActionType.GNB_ACUBED_NET) {
            this.title = 'Acubed Net';
            this.hideSpinner();
        }
        else if (this.gnbTypeId === ActionType.GNB_WIDGET_LIST) {
            this.title = 'Widget List';
            this._makeSidebarPanel(WidgetListModule);
        }
    }

    /**
     * dynamic creation module
     */
    private _makeSidebarPanel(module: any, isNotification?: boolean): Promise<any> {
        if (!module) { return Promise.resolve(false); }

        const config = module.config();
        return this.compiler
            .compileModuleAndAllComponentsAsync(module)
            .then((mod) => {
                const factory = mod.componentFactories.find((comp) =>
                    comp.componentType === config.component
                );

                this._dynamicComponentRef = this.container.createComponent(factory);
                if (isNotification && this.detailNotification) {
                    const instance = this._dynamicComponentRef.instance;
                    instance.setDetailInfo(this.detailNotification);
                }

                return this._dynamicComponentRef;
            });
    }

    /**
     * tasker, widget, dashboard list component에서 오는 명령을 받아서 처리한다.
     */
    private _setSidebarComponentListen() {
        this._sidebarInnerSubscription = this.sidebar.getObservable().subscribe((command) => {
            if (command.type === SPINNER.INIT) {
                this.showSpinner();
            } else if (command.type === SPINNER.NODATA) {
                this.showNoData();
            } else if (command.type === SPINNER.NONE) {
                this.hideSpinner();
            } else if (command.type === SPINNER.ERROR) {
                this.showError();
            } else if (command.type === 'SHOW_NOTIFICATION_DETAIL') {
                this.style = this.lastStyle + ' with-child';
                this.detailNotification = command.data;
                this.cd.detectChanges();
            } else if (command.type === 'HIDE_NOTIFICATION_DETAIL') {
                // without with-child class
                this.style = this.lastStyle;
                this.cd.detectChanges();
            } else if (command.type === 'OVERFLOW_HIDDEN') {
                this.sidebarContainer.nativeElement.style.overflow = 'hidden';
            } else if (command.type === 'OVERFLOW_AUTO') {
                this.sidebarContainer.nativeElement.style.overflow = 'auto';
            }
        });
    }

    clearDOM() {
        if ($('[a3p-sidebar-panel]')) {
            $('[a3p-sidebar-panel]').remove();
        }
        // immportant !!! we must call ComponetRef.destroy()
        if (this._dynamicComponentRef) {
            this._dynamicComponentRef.destroy();
        }
    }

    closeSidebar() {
        this.sidebarAction.close();
    }

    toggleSize() {
        this.sidebarAction.toggleSize(this.state.gnbTypeId, this.state.status);
    }

    addDashboard() {
        this.communicationAction.addDashboard();
    }

    /** spinner **/
    showSpinner() {
        (<any>this.spinner).showSpinner();
    }

    showNoData() {
        (<any>this.spinner).showNoData();
    }

    hideSpinner() {
        (<any>this.spinner).hideSpinner();
    }

    showError() {
        (<any>this.spinner).showError();
    }

    showDescription(isShow: boolean) {
        this.isShowDesc = isShow;
    }

    ngOnDestroy() {
        if (this._sidebarSubscription) {
            this._sidebarSubscription.unsubscribe();
        }

        if (this._sidebarInnerSubscription) {
            this._sidebarInnerSubscription.unsubscribe();
        }
    }
}
