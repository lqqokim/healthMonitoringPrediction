System.register(["wijmo/wijmo.grid.filter", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcGridFilter, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexGridFilterMeta, WjFlexGridFilter, moduleExports, WjGridFilterModule;
    return {
        setters: [
            function (wjcGridFilter_1) {
                wjcGridFilter = wjcGridFilter_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
                core_2 = core_1_1;
                core_3 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (wijmo_angular2_directiveBase_1_1) {
                wijmo_angular2_directiveBase_1 = wijmo_angular2_directiveBase_1_1;
            }
        ],
        execute: function () {
            exports_1("wjFlexGridFilterMeta", wjFlexGridFilterMeta = {
                selector: 'wj-flex-grid-filter',
                template: "",
                inputs: [
                    'wjProperty',
                    'showFilterIcons',
                    'showSortButtons',
                    'defaultFilterType',
                    'filterColumns',
                ],
                outputs: [
                    'initialized',
                    'filterChangingNg: filterChanging',
                    'filterChangedNg: filterChanged',
                    'filterAppliedNg: filterApplied',
                ],
                providers: []
            });
            /**
             * Angular 2 component for the @see:wijmo.grid.filter.FlexGridFilter control.
             *
             * The <b>wj-flex-grid-filter</b> component must be
             * contained in a @see:wijmo/wijmo.angular2.grid.WjFlexGrid component.
             *
             * Use the <b>wj-flex-grid-filter</b> component to add <b>FlexGridFilter</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjFlexGridFilter</b> component is derived from the <b>FlexGridFilter</b> control and
             * inherits all its properties, events and methods.
            */
            WjFlexGridFilter = (function (_super) {
                __extends(WjFlexGridFilter, _super);
                function WjFlexGridFilter(elRef, injector, parentCmp) {
                    var _this = _super.call(this, parentCmp) || this;
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
                     * Angular (EventEmitter) version of the Wijmo <b>filterChanging</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>filterChanging</b> Wijmo event name.
                     */
                    _this.filterChangingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>filterChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>filterChanged</b> Wijmo event name.
                     */
                    _this.filterChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>filterApplied</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>filterApplied</b> Wijmo event name.
                     */
                    _this.filterAppliedNg = new core_1.EventEmitter(false);
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
                WjFlexGridFilter.prototype.created = function () {
                };
                WjFlexGridFilter.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexGridFilter.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexGridFilter.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjFlexGridFilter;
            }(wjcGridFilter.FlexGridFilter));
            WjFlexGridFilter.meta = {
                outputs: wjFlexGridFilterMeta.outputs,
            };
            WjFlexGridFilter.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjFlexGridFilterMeta.selector,
                            template: wjFlexGridFilterMeta.template,
                            inputs: wjFlexGridFilterMeta.inputs,
                            outputs: wjFlexGridFilterMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexGridFilter; }) }
                            ].concat(wjFlexGridFilterMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexGridFilter.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjFlexGridFilter", WjFlexGridFilter);
            moduleExports = [
                WjFlexGridFilter
            ];
            WjGridFilterModule = (function () {
                function WjGridFilterModule() {
                }
                return WjGridFilterModule;
            }());
            WjGridFilterModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjGridFilterModule.ctorParameters = function () { return []; };
            exports_1("WjGridFilterModule", WjGridFilterModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.grid.filter.js.map