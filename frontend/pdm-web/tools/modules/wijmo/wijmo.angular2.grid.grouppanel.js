System.register(["wijmo/wijmo.grid.grouppanel", "@angular/core", "@angular/common", "@angular/forms", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcGridGrouppanel, core_1, core_2, core_3, common_1, forms_1, wijmo_angular2_directiveBase_1, wjGroupPanelMeta, WjGroupPanel, moduleExports, WjGridGrouppanelModule;
    return {
        setters: [
            function (wjcGridGrouppanel_1) {
                wjcGridGrouppanel = wjcGridGrouppanel_1;
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
            exports_1("wjGroupPanelMeta", wjGroupPanelMeta = {
                selector: 'wj-group-panel',
                template: "",
                inputs: [
                    'wjModelProperty',
                    'isDisabled',
                    'hideGroupedColumns',
                    'maxGroups',
                    'placeholder',
                    'grid',
                ],
                outputs: [
                    'initialized',
                    'gotFocusNg: gotFocus',
                    'lostFocusNg: lostFocus',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.grid.grouppanel.GroupPanel control.
             *
             * Use the <b>wj-group-panel</b> component to add <b>GroupPanel</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjGroupPanel</b> component is derived from the <b>GroupPanel</b> control and
             * inherits all its properties, events and methods.
            */
            WjGroupPanel = (function (_super) {
                __extends(WjGroupPanel, _super);
                function WjGroupPanel(elRef, injector, parentCmp) {
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
                     * Angular (EventEmitter) version of the Wijmo <b>gotFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>gotFocus</b> Wijmo event name.
                     */
                    _this.gotFocusNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>lostFocus</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>lostFocus</b> Wijmo event name.
                     */
                    _this.lostFocusNg = new core_1.EventEmitter(false);
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
                WjGroupPanel.prototype.created = function () {
                };
                WjGroupPanel.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjGroupPanel.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjGroupPanel.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjGroupPanel;
            }(wjcGridGrouppanel.GroupPanel));
            WjGroupPanel.meta = {
                outputs: wjGroupPanelMeta.outputs,
            };
            WjGroupPanel.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjGroupPanelMeta.selector,
                            template: wjGroupPanelMeta.template,
                            inputs: wjGroupPanelMeta.inputs,
                            outputs: wjGroupPanelMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjGroupPanel; }) }
                            ].concat(wjGroupPanelMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjGroupPanel.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjGroupPanel", WjGroupPanel);
            moduleExports = [
                WjGroupPanel
            ];
            WjGridGrouppanelModule = (function () {
                function WjGridGrouppanelModule() {
                }
                return WjGridGrouppanelModule;
            }());
            WjGridGrouppanelModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjGridGrouppanelModule.ctorParameters = function () { return []; };
            exports_1("WjGridGrouppanelModule", WjGridGrouppanelModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.grid.grouppanel.js.map