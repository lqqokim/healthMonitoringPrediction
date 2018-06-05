import {
    Component, OnInit, OnDestroy, ElementRef,
    ViewChild, ViewContainerRef, ComponentRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import {
    StateManager,
    WidgetModel,
    PropertiesModel,
    PropertiesAction,
    DashboardAction,
    RequestType
} from '../../../../common';
import {
    FormControlBase,
    FormBuilderService,
    SpinnerComponent,
    NotifyService
} from '../../../../sdk';

import { WidgetContainerService } from '../widget-container.service';
import { DashboardsService } from '../../dashboards.service';

@Component({
    moduleId: module.id,
    selector: 'div.a3p-widget-configuration-container',
    templateUrl: 'widget-configuration-container.html'
})
export class WidgetConfigurationContainerComponent implements OnInit, OnDestroy {

    @ViewChild('widgetConfigurationGenerator', { read: ViewContainerRef }) widgetGeneratorEl: ViewContainerRef;
    @ViewChild('widgetConfigurationBody') widgetBodyEl: ElementRef;

    // for dynamic form
    configurationFormGroup: FormGroup = new FormGroup({});
    configurationFormControls: FormControlBase<any>[] = [];

    style: string = '';
    widgetModel: WidgetModel;
    isRefresh: boolean = false;

    @ViewChild('spinner') spinner: SpinnerComponent;
    isBlur: boolean;

    private _isAlreadyApply: boolean = false;
    private _configurationSubscription: Subscription;
    private _formSubscription: Subscription;
    // for widget
    private _widgetApiNotifier = new Subject<RequestType>();
    private _widgetApiObservable$ = this._widgetApiNotifier.asObservable();
    private _widgetConfigurationContainerNotifier = new Subject<RequestType>();
    private _widgetConfigurationContainerObservable$ = this._widgetConfigurationContainerNotifier.asObservable();
    private _widgetComponent: ComponentRef<any>;
    private _widgetConfigurationContainerSubscription: Subscription;

    constructor(
        private container: ViewContainerRef,
        private stateManager: StateManager,
        private dashboards: DashboardsService,
        private widgetContainer: WidgetContainerService,
        private dashboardAction: DashboardAction,
        private propertiesAction: PropertiesAction,
        private formBuilder: FormBuilderService,
        private notify: NotifyService
    ) { }

    ngOnInit() {
        this._setState();
        this._listenWigetApi();
    }

    private _setState() {
        const properties$ = this.stateManager.rxProperties();
        this._configurationSubscription = properties$.subscribe((properties: PropertiesModel) => {
            if (properties.actionType !== ActionType.OPEN_WIDGET_PROPERTIES
                && properties.actionType !== ActionType.CLOSE_WIDGET_PROPERTIES) {
                return;
            }

            if (properties.status === 'open') {
                this.widgetModel = properties.widget;
                this.style = `active ${this.stateManager.getWidgetType(this.widgetModel.widgetTypeId).name}`;
                setTimeout(() => {
                    this._buildWidget();
                    this._buildForm();
                }, 50);
            }
            else if (properties.status === 'hide') {
                this.style = '';
                this.isRefresh = false;
                this.widgetModel = undefined;
                if (this._formSubscription) {
                    this._formSubscription.unsubscribe();
                    this._formSubscription = undefined;
                }
                if (this.configurationFormGroup) {
                    this.configurationFormGroup.reset();
                }

                if (this._widgetComponent) {
                    this._widgetComponent.destroy();
                    this._widgetComponent = undefined;
                }

                setTimeout(() => {
                    this.clearDOM();
                }, 50);
            }
        });
    }

    private _listenWigetApi() {
        if (this._widgetConfigurationContainerSubscription) {
            this._widgetConfigurationContainerSubscription.unsubscribe();
        }
        this._widgetConfigurationContainerSubscription = this._widgetConfigurationContainerObservable$.subscribe(
            (request: RequestType) => {
                if (request.type === SPINNER.INIT) {
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

    private _handleError(e: any) {
        console.log('Widget Container Component, Exception', e);
    }

    private _changeForm() {
        if (this._formSubscription) {
            this._formSubscription.unsubscribe();
        }
        this._formSubscription = this.configurationFormGroup.valueChanges
            .startWith(null)
            .scan((before, current) => {
                return {
                    before: this._removeNoneCheckingProps(before),
                    current: this._removeNoneCheckingProps(current)
                };
            })
            .filter(data => data !== null)
            .subscribe((data) => {
                if (!this.configurationFormGroup.valid) {
                    return;
                }
                this.isRefresh = !_.isEqual(data.before, data.current);
            });
    }

    private _removeNoneCheckingProps(props: any = null): any {
        if (props) {
            delete props.communication;
            delete props.autoRefresh;
        }
        return props;
    }

    private _buildWidget() {
        this.widgetContainer
            .createWidget(
                this.widgetModel,
                this.widgetGeneratorEl,
                this.widgetBodyEl,
                this._widgetApiObservable$,
                this._widgetConfigurationContainerNotifier,
                this.container.element.nativeElement,
                true
            )
            .then((cmp: ComponentRef<any>) => {
                this._widgetComponent = cmp;
            });
    }

    private _buildForm() {
        if (!this.widgetModel.form) {
            console.warn('Are you sure there is no configuration for properties?');
            return;
        }

        this.formBuilder
            .buildForm(this.widgetModel.form, this.widgetModel, 'properties')
            .then(({ formGroup, formControls }) => {
                this.configurationFormGroup = formGroup;
                this.configurationFormControls = formControls;
                this._changeForm();
            });
    }

    clearDOM() {
        // this._beforeProps = undefined;
        if ($('a3s-dynamic-form')) {
            $('a3s-dynamic-form').children().remove();
        }
    }

    applyConfiguration() {
        if (this.widgetModel) {
            delete this.widgetModel.form;
        }

        this.dashboards
            .applyWidgetProperties(this.widgetModel)
            .then(() => {
                this.dashboardAction.updateWidget(this.widgetModel);
                this.propertiesAction.applyWidgetConfiguration(this.widgetModel);
                this.notify.success('MESSAGE.GENERAL.WIDGET_PROPERTIES_SUCESS');

                this._isAlreadyApply = true;
                this.propertiesAction.closeWidgetConfiguration(this.widgetModel);
            }, (error: any) => {
                this.notify.error('MESSAGE.GENERAL.WIDGET_PROPERTIES_ERROR');
                console.log('update widget configuration exception: ', error);
            });
    }

    closeConfiguration() {
        this.propertiesAction.closeWidgetConfiguration(this.widgetModel);
    }

    refreshConfiguration() {
        this.isRefresh = false;

        // TODO refresh
        const requester = (<any>this._widgetComponent.instance).requester;
        if (requester) {
            requester.next({
                type: A3_WIDGET.APPLY_CONFIG_REFRESH,
                data: this.widgetModel
            });
        }
    }

    ngOnDestroy() {
        if (this._configurationSubscription) {
            this._configurationSubscription.unsubscribe();
        }

        if (this._widgetConfigurationContainerSubscription) {
            this._widgetConfigurationContainerSubscription.unsubscribe();
        }
    }
}
