System.register(["wijmo/wijmo.viewer", "wijmo/wijmo", "@angular/core", "@angular/common", "@angular/forms", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
    "use strict";
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __moduleName = context_1 && context_1.id;
    var wjcViewer, wjcCore, core_1, core_2, core_3, common_1, forms_1, wijmo_angular2_directiveBase_1, wjReportViewerMeta, WjReportViewer, wjPdfViewerMeta, WjPdfViewer, moduleExports, WjViewerModule;
    return {
        setters: [
            function (wjcViewer_1) {
                wjcViewer = wjcViewer_1;
            },
            function (wjcCore_1) {
                wjcCore = wjcCore_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (wijmo_angular2_directiveBase_1_1) {
                wijmo_angular2_directiveBase_1 = wijmo_angular2_directiveBase_1_1;
            }
        ],
        execute: function () {
            exports_1("wjReportViewerMeta", wjReportViewerMeta = {
                selector: 'wj-report-viewer',
                template: "",
                inputs: [
                    'wjModelProperty',
                    'serviceUrl',
                    'filePath',
                    'fullScreen',
                    'zoomFactor',
                    'mouseMode',
                    'selectMouseMode',
                    'viewMode',
                    'paginated',
                    'reportName',
                ],
                outputs: [
                    'initialized',
                    'pageIndexChangedNg: pageIndexChanged',
                    'viewModeChangedNg: viewModeChanged',
                    'viewModeChangePC: viewModeChange',
                    'mouseModeChangedNg: mouseModeChanged',
                    'mouseModeChangePC: mouseModeChange',
                    'selectMouseModeChangedNg: selectMouseModeChanged',
                    'selectMouseModeChangePC: selectMouseModeChange',
                    'fullScreenChangedNg: fullScreenChanged',
                    'fullScreenChangePC: fullScreenChange',
                    'zoomFactorChangedNg: zoomFactorChanged',
                    'zoomFactorChangePC: zoomFactorChange',
                    'queryLoadingDataNg: queryLoadingData',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.viewer.ReportViewer control.
             *
             * Use the <b>wj-report-viewer</b> component to add <b>ReportViewer</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
            * The <b>WjReportViewer</b> component is derived from the <b>ReportViewer</b> control and
             * inherits all its properties, events and methods.
            */
            WjReportViewer = (function (_super) {
                __extends(WjReportViewer, _super);
                function WjReportViewer(elRef, injector, parentCmp) {
                    var _this = _super.call(this, wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(elRef)) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>pageIndexChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>pageIndexChanged</b> Wijmo event name.
                     */
                    _this.pageIndexChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>viewModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>viewModeChanged</b> Wijmo event name.
                     */
                    _this.viewModeChangedNg = new core_1.EventEmitter(false);
                    _this.viewModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>mouseModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>mouseModeChanged</b> Wijmo event name.
                     */
                    _this.mouseModeChangedNg = new core_1.EventEmitter(false);
                    _this.mouseModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>selectMouseModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>selectMouseModeChanged</b> Wijmo event name.
                     */
                    _this.selectMouseModeChangedNg = new core_1.EventEmitter(false);
                    _this.selectMouseModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>fullScreenChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>fullScreenChanged</b> Wijmo event name.
                     */
                    _this.fullScreenChangedNg = new core_1.EventEmitter(false);
                    _this.fullScreenChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>zoomFactorChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>zoomFactorChanged</b> Wijmo event name.
                     */
                    _this.zoomFactorChangedNg = new core_1.EventEmitter(false);
                    _this.zoomFactorChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>queryLoadingData</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>queryLoadingData</b> Wijmo event name.
                     */
                    _this.queryLoadingDataNg = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjReportViewer.prototype.created = function () {
                };
                WjReportViewer.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjReportViewer.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjReportViewer.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                WjReportViewer.prototype.onSelectMouseModeChanged = function (e) {
                    // Wijmo interop always subscribes to any event, so we issue a deprecated warning
                    // only if there are more than one subscriber. 
                    if (this.selectMouseModeChanged['_handlers'].length > 1 ||
                        this.selectMouseModeChangedNg.observers.length > 0) {
                        wjcCore._deprecated('selectMouseModeChanged', 'mouseModeChanged');
                    }
                    this.selectMouseModeChanged.raise(this, e);
                };
                return WjReportViewer;
            }(wjcViewer.ReportViewer));
            WjReportViewer.meta = {
                outputs: wjReportViewerMeta.outputs,
                changeEvents: {
                    'viewModeChanged': ['viewMode'],
                    'mouseModeChanged': ['mouseMode'],
                    'selectMouseModeChanged': ['selectMouseMode'],
                    'fullScreenChanged': ['fullScreen'],
                    'zoomFactorChanged': ['zoomFactor']
                },
            };
            WjReportViewer.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjReportViewerMeta.selector,
                            template: wjReportViewerMeta.template,
                            inputs: wjReportViewerMeta.inputs,
                            outputs: wjReportViewerMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjReportViewer; }) }
                            ].concat(wjReportViewerMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjReportViewer.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjReportViewer", WjReportViewer);
            exports_1("wjPdfViewerMeta", wjPdfViewerMeta = {
                selector: 'wj-pdf-viewer',
                template: "",
                inputs: [
                    'wjModelProperty',
                    'serviceUrl',
                    'filePath',
                    'fullScreen',
                    'zoomFactor',
                    'mouseMode',
                    'selectMouseMode',
                    'viewMode',
                ],
                outputs: [
                    'initialized',
                    'pageIndexChangedNg: pageIndexChanged',
                    'viewModeChangedNg: viewModeChanged',
                    'viewModeChangePC: viewModeChange',
                    'mouseModeChangedNg: mouseModeChanged',
                    'mouseModeChangePC: mouseModeChange',
                    'selectMouseModeChangedNg: selectMouseModeChanged',
                    'selectMouseModeChangePC: selectMouseModeChange',
                    'fullScreenChangedNg: fullScreenChanged',
                    'fullScreenChangePC: fullScreenChange',
                    'zoomFactorChangedNg: zoomFactorChanged',
                    'zoomFactorChangePC: zoomFactorChange',
                    'queryLoadingDataNg: queryLoadingData',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.viewer.PdfViewer control.
             *
             * Use the <b>wj-pdf-viewer</b> component to add <b>PdfViewer</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
            * The <b>WjPdfViewer</b> component is derived from the <b>PdfViewer</b> control and
             * inherits all its properties, events and methods.
            */
            WjPdfViewer = (function (_super) {
                __extends(WjPdfViewer, _super);
                function WjPdfViewer(elRef, injector, parentCmp) {
                    var _this = _super.call(this, wijmo_angular2_directiveBase_1.WjDirectiveBehavior.getHostElement(elRef)) || this;
                    /**
                     * Indicates whether the component has been initialized by Angular.
                     * Changes its value from false to true right before triggering the <b>initialized</b> event.
                     */
                    _this.isInitialized = false;
                    /**
                     * This event is triggered after the component has been initialized by Angular, that is
                     * all bound properties have been assigned and child components (if any) have been initialized.
                     */
                    _this.initialized = new core_1.EventEmitter(true);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>pageIndexChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>pageIndexChanged</b> Wijmo event name.
                     */
                    _this.pageIndexChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>viewModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>viewModeChanged</b> Wijmo event name.
                     */
                    _this.viewModeChangedNg = new core_1.EventEmitter(false);
                    _this.viewModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>mouseModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>mouseModeChanged</b> Wijmo event name.
                     */
                    _this.mouseModeChangedNg = new core_1.EventEmitter(false);
                    _this.mouseModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>selectMouseModeChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>selectMouseModeChanged</b> Wijmo event name.
                     */
                    _this.selectMouseModeChangedNg = new core_1.EventEmitter(false);
                    _this.selectMouseModeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>fullScreenChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>fullScreenChanged</b> Wijmo event name.
                     */
                    _this.fullScreenChangedNg = new core_1.EventEmitter(false);
                    _this.fullScreenChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>zoomFactorChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>zoomFactorChanged</b> Wijmo event name.
                     */
                    _this.zoomFactorChangedNg = new core_1.EventEmitter(false);
                    _this.zoomFactorChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>queryLoadingData</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>queryLoadingData</b> Wijmo event name.
                     */
                    _this.queryLoadingDataNg = new core_1.EventEmitter(false);
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this.created();
                    return _this;
                }
                /**
                 * If you create a custom component inherited from a Wijmo component, you can override this
                 * method and perform necessary initializations that you usually do in a class constructor.
                 * This method is called in the last line of a Wijmo component constructor and allows you
                 * to not declare your custom component's constructor at all, thus preventing you from a necessity
                 * to maintain constructor parameters and keep them in synch with Wijmo component's constructor parameters.
                 */
                WjPdfViewer.prototype.created = function () {
                };
                WjPdfViewer.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjPdfViewer.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjPdfViewer.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                WjPdfViewer.prototype.onSelectMouseModeChanged = function (e) {
                    // Wijmo interop always subscribes to any event, so we issue a deprecated warning
                    // only if there are more than one subscriber. 
                    if (this.selectMouseModeChanged['_handlers'].length > 1 ||
                        this.selectMouseModeChangedNg.observers.length > 0) {
                        wjcCore._deprecated('selectMouseModeChanged', 'mouseModeChanged');
                    }
                    this.selectMouseModeChanged.raise(this, e);
                };
                return WjPdfViewer;
            }(wjcViewer.PdfViewer));
            WjPdfViewer.meta = {
                outputs: wjPdfViewerMeta.outputs,
                changeEvents: {
                    'viewModeChanged': ['viewMode'],
                    'mouseModeChanged': ['mouseMode'],
                    'selectMouseModeChanged': ['selectMouseMode'],
                    'fullScreenChanged': ['fullScreen'],
                    'zoomFactorChanged': ['zoomFactor']
                },
            };
            WjPdfViewer.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjPdfViewerMeta.selector,
                            template: wjPdfViewerMeta.template,
                            inputs: wjPdfViewerMeta.inputs,
                            outputs: wjPdfViewerMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjPdfViewer; }) }
                            ].concat(wjPdfViewerMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjPdfViewer.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjPdfViewer", WjPdfViewer);
            moduleExports = [
                WjReportViewer,
                WjPdfViewer
            ];
            WjViewerModule = (function () {
                function WjViewerModule() {
                }
                return WjViewerModule;
            }());
            WjViewerModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjViewerModule.ctorParameters = function () { return []; };
            exports_1("WjViewerModule", WjViewerModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.viewer.js.map