System.register(["wijmo/wijmo.grid.detail", "@angular/core", "@angular/common", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcGridDetail, core_1, core_2, core_3, common_1, wijmo_angular2_directiveBase_1, wjFlexGridDetailMeta, WjFlexGridDetail, moduleExports, WjGridDetailModule;
    return {
        setters: [
            function (wjcGridDetail_1) {
                wjcGridDetail = wjcGridDetail_1;
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
            exports_1("wjFlexGridDetailMeta", wjFlexGridDetailMeta = {
                selector: '[wjFlexGridDetail]',
                inputs: [
                    'wjFlexGridDetail',
                    'maxHeight',
                    'detailVisibilityMode',
                    'rowHasDetail',
                    'isAnimated',
                ],
                outputs: [
                    'initialized',
                ],
                exportAs: 'wjFlexGridDetail',
                providers: []
            });
            /**
                * Angular 2 directive for @see:FlexGrid @see:DetailRow templates.
                *
                * The <b>wj-flex-grid-detail</b> directive must be specified on a <b>&lt;template&gt;</b>
                * template element contained in a <b>wj-flex-grid</b> component.
                *
                * The <b>wj-flex-grid-detail</b> directive is derived from the @see:FlexGridDetailProvider
                * class that maintains detail rows visibility, with detail rows content defined as
                * an arbitrary HTML fragment within the directive tag. The fragment may contain
                * Angular 2 bindings, components and directives.
                * The <b>row</b> and
                * <b>item</b> template variables can be used in Angular 2 bindings that refer to
                * the detail row's parent @see:Row and <b>Row.dataItem</b> objects.
                *
                */
            WjFlexGridDetail = (function (_super) {
                __extends(WjFlexGridDetail, _super);
                function WjFlexGridDetail(elRef, injector, parentCmp, viewContainerRef, templateRef, domRenderer) {
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
                    var behavior = _this._wjBehaviour = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.attach(_this, elRef, injector, parentCmp);
                    _this._viewContainerRef = viewContainerRef;
                    _this._templateRef = templateRef;
                    _this._domRenderer = domRenderer;
                    _this._init();
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
                WjFlexGridDetail.prototype.created = function () {
                };
                WjFlexGridDetail.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjFlexGridDetail.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjFlexGridDetail.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                WjFlexGridDetail.prototype._init = function () {
                    var _this = this;
                    // show detail when asked to
                    this.createDetailCell = function (row, col) {
                        var templ = wijmo_angular2_directiveBase_1.WjDirectiveBehavior.instantiateTemplate(_this.grid.hostElement, _this._viewContainerRef, _this._templateRef, _this._domRenderer), viewRef = templ.viewRef, templRoot = templ.rootElement;
                        //viewRef.setLocal('row', row);
                        //viewRef.setLocal('col', col);
                        //viewRef.setLocal('item', row.dataItem);
                        viewRef.context.row = row;
                        viewRef.context.col = col;
                        viewRef.context.item = row.dataItem;
                        templRoot.parentElement.removeChild(templRoot);
                        templRoot[WjFlexGridDetail._viewRefProp] = viewRef;
                        return templRoot;
                    };
                    // dispose detail scope when asked to
                    this.disposeDetailCell = function (row) {
                        var viewRef;
                        if (row.detail && (viewRef = row.detail[WjFlexGridDetail._viewRefProp])) {
                            row.detail[WjFlexGridDetail._viewRefProp] = null;
                            var idx = _this._viewContainerRef.indexOf(viewRef);
                            if (idx > -1) {
                                _this._viewContainerRef.remove(idx);
                            }
                        }
                    };
                };
                return WjFlexGridDetail;
            }(wjcGridDetail.FlexGridDetailProvider));
            WjFlexGridDetail._viewRefProp = '__wj_viewRef';
            WjFlexGridDetail.meta = {
                outputs: wjFlexGridDetailMeta.outputs,
            };
            WjFlexGridDetail.decorators = [
                { type: core_2.Directive, args: [{
                            selector: wjFlexGridDetailMeta.selector,
                            inputs: wjFlexGridDetailMeta.inputs,
                            outputs: wjFlexGridDetailMeta.outputs,
                            exportAs: wjFlexGridDetailMeta.exportAs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjFlexGridDetail; }) }
                            ].concat(wjFlexGridDetailMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjFlexGridDetail.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
                { type: core_2.ViewContainerRef, decorators: [{ type: core_3.Inject, args: [core_2.ViewContainerRef,] },] },
                { type: core_2.TemplateRef, decorators: [{ type: core_3.Inject, args: [core_2.TemplateRef,] },] },
                { type: core_2.Renderer, decorators: [{ type: core_3.Inject, args: [core_2.Renderer,] },] },
            ]; };
            exports_1("WjFlexGridDetail", WjFlexGridDetail);
            moduleExports = [
                WjFlexGridDetail
            ];
            WjGridDetailModule = (function () {
                function WjGridDetailModule() {
                }
                return WjGridDetailModule;
            }());
            WjGridDetailModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjGridDetailModule.ctorParameters = function () { return []; };
            exports_1("WjGridDetailModule", WjGridDetailModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.grid.detail.js.map