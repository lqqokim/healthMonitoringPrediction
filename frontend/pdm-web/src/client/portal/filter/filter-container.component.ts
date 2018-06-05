import { 
    Component, OnInit, ComponentRef, ViewContainerRef, ViewChild,
    ChangeDetectorRef, Compiler, OnDestroy
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription'; 

import { ChartApi, NotifyService } from '../../sdk';

import {
    StateManager,
    FilterAction,
    PropertiesAction,
    PropertiesModel,
    FilterModel,
    FilterRequester
} from '../../common';

import { SidebarService } from '../sidebar/sidebar.service';
import { getWidgetClassInfo } from '../../plugins/widgets';
import { getTaskerClassInfo } from './../../plugins/taskers';

@Component({
    moduleId: module.id,
    selector: 'div.a3p-filter-container',
    templateUrl: 'filter-container.html',
})
export class FilterContainerComponent implements OnInit, OnDestroy {

    style: string = '';
    title: string = '';
    filterSpinner: any = SPINNER.TYPE.SIDE_BAR;
    requester: FilterRequester;
    private isOpenConfiguration: boolean;
    private _typeName: string;
    private _filterSubscription: Subscription;
    private _propertiesSubscription: Subscription;
    private _dynamicComponentRef: ComponentRef<any>;
    private _sidebarInnerSubscription: Subscription;

    @ViewChild('filterBodyGenerator', { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('spinner') spinner: ChartApi;

    constructor(
        private stateManager: StateManager,
        private filterAction: FilterAction,
        private propertiesAction: PropertiesAction,
        private cd: ChangeDetectorRef,
        private compiler: Compiler,
        private sidebar: SidebarService,
        private notifier: NotifyService
    ) {}

    ngOnInit() {
        this._setState();
        // this._setGlobalHide();
        this._setSidebarComponentListen();
    }

    _setState() {
        const filter$ = this.stateManager.rxFilter();

        this._filterSubscription = filter$.subscribe((filterModel: FilterModel) => {
            if (filterModel.status === ActionType.CLOSE_FILTER_CONTAINER) {
                this.clearDOM();
                this.style = '';
                this.cd.detectChanges();
            }
            else if (filterModel.status === ActionType.OPEN_FILTER_CONTAINER) {
                if (this.isOpenConfiguration) {
                    this.notifier.warn('you can not open filter panel');
                    return;
                }

                if (filterModel.model.title) {
                    this.title = filterModel.model.title;
                }
                this._typeName = this._getTypeName(filterModel);
                this.style = this._typeName + ' active';
                this.requester = filterModel.requester;
                this._makeWidgetFilterPanel(filterModel);
                this.cd.detectChanges();
            }
        },
        this._handleError);

        const properties$ = this.stateManager.rxProperties();
        this._propertiesSubscription = properties$.subscribe((propertiesModel: PropertiesModel) => {
            if (propertiesModel.actionType === ActionType.OPEN_WIDGET_PROPERTIES) {
                this.isOpenConfiguration =  true;
            } else if (propertiesModel.actionType === ActionType.CLOSE_WIDGET_PROPERTIES) {
                this.isOpenConfiguration = false;
            }
        });
    }

    _getTypeName(filterModel: FilterModel) {
        let type;
        if (filterModel.isTasker) {
            type = this.stateManager.getTaskerType(filterModel.model.taskerTypeId);
        } else {
            type = this.stateManager.getWidgetType(filterModel.model.widgetTypeId);
        }
        return type.name;
    }

    _handleError(e: any) {
        console.log('Filter Container Component, Exception', e);
    }

    _setSidebarComponentListen() {
        this._sidebarInnerSubscription = this.sidebar.getObservable().subscribe((command) => {
            if (command === SPINNER.NONE) {
                this.hideSpinner();
            }
            else if (command === SPINNER.ERROR) {
                this.showError();
            }
        });
    }

    clearDOM() {
        if ($('[a3p-filter-panel]')) {
            $('[a3p-filter-panel]').remove();
        }
        // immportant !!! we must call ComponetRef.destroy()
        if (this._dynamicComponentRef) {
            this._dynamicComponentRef.destroy();
        }
    }

    _makeWidgetFilterPanel(filterModel: FilterModel): any {
        const module = this._getFilterModule(filterModel);
        if (!module) { return; }

        const config = module.config();
        return this.compiler
            .compileModuleAndAllComponentsAsync(module)
            .then((mod) => {
                const factory = mod.componentFactories.find((comp) =>
                    comp.componentType === config.component
                );

                this._dynamicComponentRef = this.container.createComponent(factory);
                const instance: any = this._dynamicComponentRef.instance;

                if (instance.setRequester && typeof instance.setRequester === 'function') {
                    instance.setRequester(filterModel.requester);
                } else {
                    console.error('You must extend WidgetFilterApi for your widget filter component!');
                }

                return this._dynamicComponentRef;
            });
    }

    _getFilterModule(filterModel: FilterModel) {
        let module;
        if (filterModel.isTasker) {
            module = getTaskerClassInfo(this._typeName);
        } else {
            module = getWidgetClassInfo(this._typeName);
        }
        // name is widget type's KEY
        if (!module.config || typeof module.config !== 'function') {
            console.error('A static config() is not in module. Please setup static config()');
            return;
        }
        if (!module.config().filterModule) {
            console.error('There is no filter module for widget');
            return;
        }
        return module.config().filterModule;
    }

    closeFilter() {
        this.filterAction.close();
    }

    applyFilter() {
        const validator = this.requester.getValidator();
        if (validator) {
            if(validator()) {
                this.requester.applyFilter();
                this.closeFilter();
            }
        } else {
            this.requester.applyFilter();
            this.closeFilter();
        }
    }

    /** spinner **/
    showSpinner() {
        (<any>this.spinner).showSpinner();
    }

    hideSpinner() {
        (<any>this.spinner).hideSpinner();
    }

    showError() {
        (<any>this.spinner).showError();
    }

    ngOnDestroy() {
        if (this._filterSubscription) {
            this._filterSubscription.unsubscribe();
        }

        if (this._sidebarInnerSubscription) {
            this._sidebarInnerSubscription.unsubscribe();
        }

        if (this._propertiesSubscription) {
            this._propertiesSubscription.unsubscribe();
        }
    }
}