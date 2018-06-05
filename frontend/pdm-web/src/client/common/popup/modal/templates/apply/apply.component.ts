import { Compiler, Component, OnInit, ViewChild, ElementRef, OnDestroy, ViewContainerRef, ComponentRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ChartApi } from './../../../../../sdk';

import { ModalApplier } from './modal-applier';
import { ModalRequester } from '../../modal-requester';
import { ModalModel } from './../../../../app-state/modal/modal.type';

@Component({
    moduleId: module.id,
    selector: 'apply-modal',
    templateUrl: 'apply.html'
})
export class ApplyComponent implements OnInit, OnDestroy {

    @ViewChild('smModal') modal: any;
    @ViewChild('modalModule', { read: ViewContainerRef }) container: ViewContainerRef;
    @ViewChild('spinner') spinner: ChartApi;
    title: string;
    state: any;
    hideApplyButton: boolean;
    props: any;
    style: string;
    disabledStyle: string;
    applySpinner: any = SPINNER.TYPE.SIDE_BAR;
    modalApplier: ModalApplier;
    private _requester: ModalRequester;
    private _subscription: Subscription;

    constructor(
        private element: ElementRef,
        private compiler: Compiler
    ) {
        this.modalApplier = new ModalApplier();
    }

    ngOnInit() {
        this.modal.show();
        this._listenApplied();
    }

    /**
     *  성공인지를 기다림 
     */
    _listenApplied() {
        this._subscription = this.modalApplier
            .listenApplySuccess()
            .subscribe((response) => {
                if (response.type === 'APPLIED') {
                    this._requester.update(response.data);
                    this._requester.destroy();
                } else if (response.type === 'FAILED') {
                    //TODO: change alert and i18n
                    //alert('Failed apply group info');
                } else if (response.type === 'ENABLED_APPLY_BUTTON') {
                    this.disabledStyle = '';
                } else if (response.type === 'DISABLED_APPLY_BUTTON') {
                    this.disabledStyle = 'disabled';
                }
            },
            (err) => {
                console.log('Apply exception', err.getMessage());
            });
    }

    /**
     * 창 크기에 대한 정보를 받으면 
     */
    setProps(props: any) {
        this.props = props;
    }

    /**
     * common modal를 호출하면 자동으로 호출됨
     * user-modify.component에 넘겨줄 값을 설정한다. 
     */
    setAction(action: ModalModel) {
        this.title = action.info.title;
        this.style = action.info.style;
        this.hideApplyButton = action.info.hideApplyButton;
        this._requester = action.requester;
        this.state = {
            applier: this.modalApplier,
            info: action.info,
        };
        if (action.module) {
            this._createModalModule(action.module, action.info.configFn, action.info.isWidgetPanel);
        }
    }

    _createModalModule(moduleType: any, otherConfigFnName: string, isWidgetPanel: boolean = false) {
        // moduleType을 생성한다.
        if (!moduleType.config || typeof moduleType.config !== 'function') {
            console.error(`A static config() is not in ${moduleType}. Please setup static config()`);
            return;
        }

        this.compiler
            .compileModuleAndAllComponentsAsync(moduleType)
            .then((mod) => {
                let config;
                if (otherConfigFnName) {
                    config = moduleType[otherConfigFnName]();
                } else {
                    config = moduleType.config();
                }
                let factory = mod.componentFactories.find((comp) =>
                    comp.componentType === config.component
                );
                let component: ComponentRef<any> = this.container.createComponent(factory, 0, this.container.injector);
                let instance: any = component.instance;

                // set modal state
                instance.isModal = true;
                instance.modalState = this.state;

                if (instance.setInfo) {
                    // supports getProp() of widget.api.ts and tasker.api.ts
                    // TODO
                    // 1. model: WidgetModel
                    // 2. widgetBodyEl: elementRef
                    // 3. containerElement: resize element DOM --> modal dom 
                    instance.setInfo(this.state.info.model, undefined, undefined, false);
                }

                if (isWidgetPanel && config.properties) {
                    return instance
                        .setPropertiesConfig(new config.properties())
                        .then(() => {
                            this._initPanel(config, instance);
                        });
                } else {
                    this._initPanel(config, instance);
                }
            });
    }

    _initPanel(config: any, instance: any) {
        if (config.inCondition) {
            instance.setInConditionConfig(new config.inCondition());
        }

        if (config.outCondition) {
            instance.setOutConditionConfig(new config.outCondition());
        }

        if (config.chartConfigs) {
            if (_.isArray(config.chartConfigs)) {
                config.chartConfigs.forEach((chartConfig: any) => {
                    chartConfig(instance);
                });
            } else {
                console.warn('chartConfigs for Container config must be Array');
            }
        }

        if (config.viewConfig) {
            instance.setViewConfig(new config.viewConfig());
        }

        const that = this;
        instance.showSpinner = this.showSpinner(that);
        instance.hideSpinner = this.hideSpinner(that);
        instance.showError = this.showError(that);
        instance.showNoData = this.showNoData(that);

        if (instance.ngOnSetup) {
            instance.ngOnSetup();
        }
    }

    /**
     *  적용해 달라고 요청함
     */
    apply() {
        if (this.disabledStyle === 'disabled') {
            return;
        }
        this.modalApplier.requestApply();
    }

    close() {
        this._requester.cancel();
        this._requester.destroy();
    }

    /** spinner **/
    showSpinner(that: any) {
        return function() {
            that.spinner.showSpinner();
        };
    }

    hideSpinner(that: any) {
        return function() {
            that.spinner.hideSpinner();
        };
    }

    showError(that: any) {
        return function() {
            that.spinner.showError();
        };
    }

    showNoData(that: any) {
        return function() {
            that.spinner.showNoData();
        };
    }

    ngOnDestroy() {
        if (this.modal) {
            this.modal.hide();
            this.modal = undefined;
        }

        $(this.element.nativeElement).remove();

        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}