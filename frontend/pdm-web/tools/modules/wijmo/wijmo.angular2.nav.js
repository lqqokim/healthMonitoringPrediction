System.register(["wijmo/wijmo.nav", "@angular/core", "@angular/common", "@angular/forms", "wijmo/wijmo.angular2.directiveBase"], function (exports_1, context_1) {
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
    var wjcNav, core_1, core_2, core_3, common_1, forms_1, wijmo_angular2_directiveBase_1, wjTreeViewMeta, WjTreeView, moduleExports, WjNavModule;
    return {
        setters: [
            function (wjcNav_1) {
                wjcNav = wjcNav_1;
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
            exports_1("wjTreeViewMeta", wjTreeViewMeta = {
                selector: 'wj-tree-view',
                template: "",
                inputs: [
                    'wjModelProperty',
                    'isDisabled',
                    'childItemsPath',
                    'displayMemberPath',
                    'imageMemberPath',
                    'isContentHtml',
                    'showCheckboxes',
                    'autoCollapse',
                    'isAnimated',
                    'isReadOnly',
                    'allowDragging',
                    'expandOnClick',
                    'lazyLoadFunction',
                    'itemsSource',
                    'selectedItem',
                    'selectedNode',
                    'checkedItems',
                ],
                outputs: [
                    'initialized',
                    'gotFocusNg: gotFocus',
                    'lostFocusNg: lostFocus',
                    'itemsSourceChangedNg: itemsSourceChanged',
                    'loadingItemsNg: loadingItems',
                    'loadedItemsNg: loadedItems',
                    'itemClickedNg: itemClicked',
                    'selectedItemChangedNg: selectedItemChanged',
                    'selectedItemChangePC: selectedItemChange',
                    'selectedNodeChangePC: selectedNodeChange',
                    'checkedItemsChangedNg: checkedItemsChanged',
                    'checkedItemsChangePC: checkedItemsChange',
                    'isCollapsedChangingNg: isCollapsedChanging',
                    'isCollapsedChangedNg: isCollapsedChanged',
                    'isCheckedChangingNg: isCheckedChanging',
                    'isCheckedChangedNg: isCheckedChanged',
                    'formatItemNg: formatItem',
                    'dragStartNg: dragStart',
                    'dragOverNg: dragOver',
                    'dropNg: drop',
                    'dragEndNg: dragEnd',
                    'nodeEditStartingNg: nodeEditStarting',
                    'nodeEditStartedNg: nodeEditStarted',
                    'nodeEditEndingNg: nodeEditEnding',
                    'nodeEditEndedNg: nodeEditEnded',
                ],
                providers: [
                    {
                        provide: forms_1.NG_VALUE_ACCESSOR, useFactory: wijmo_angular2_directiveBase_1.WjValueAccessorFactory, multi: true,
                        deps: ['WjComponent']
                    }
                ]
            });
            /**
             * Angular 2 component for the @see:wijmo.nav.TreeView control.
             *
             * Use the <b>wj-tree-view</b> component to add <b>TreeView</b> controls to your
             * Angular 2 applications. For details about Angular 2 markup syntax, see
             * <a href="static/angular2Markup.html">Angular 2 Markup</a>.
             *
             * The <b>WjTreeView</b> component is derived from the <b>TreeView</b> control and
             * inherits all its properties, events and methods.
            */
            WjTreeView = (function (_super) {
                __extends(WjTreeView, _super);
                function WjTreeView(elRef, injector, parentCmp) {
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
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>itemsSourceChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>itemsSourceChanged</b> Wijmo event name.
                     */
                    _this.itemsSourceChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>loadingItems</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>loadingItems</b> Wijmo event name.
                     */
                    _this.loadingItemsNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>loadedItems</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>loadedItems</b> Wijmo event name.
                     */
                    _this.loadedItemsNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>itemClicked</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>itemClicked</b> Wijmo event name.
                     */
                    _this.itemClickedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>selectedItemChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>selectedItemChanged</b> Wijmo event name.
                     */
                    _this.selectedItemChangedNg = new core_1.EventEmitter(false);
                    _this.selectedItemChangePC = new core_1.EventEmitter(false);
                    _this.selectedNodeChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>checkedItemsChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>checkedItemsChanged</b> Wijmo event name.
                     */
                    _this.checkedItemsChangedNg = new core_1.EventEmitter(false);
                    _this.checkedItemsChangePC = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>isCollapsedChanging</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>isCollapsedChanging</b> Wijmo event name.
                     */
                    _this.isCollapsedChangingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>isCollapsedChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>isCollapsedChanged</b> Wijmo event name.
                     */
                    _this.isCollapsedChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>isCheckedChanging</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>isCheckedChanging</b> Wijmo event name.
                     */
                    _this.isCheckedChangingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>isCheckedChanged</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>isCheckedChanged</b> Wijmo event name.
                     */
                    _this.isCheckedChangedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>formatItem</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>formatItem</b> Wijmo event name.
                     */
                    _this.formatItemNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>dragStart</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>dragStart</b> Wijmo event name.
                     */
                    _this.dragStartNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>dragOver</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>dragOver</b> Wijmo event name.
                     */
                    _this.dragOverNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>drop</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>drop</b> Wijmo event name.
                     */
                    _this.dropNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>dragEnd</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>dragEnd</b> Wijmo event name.
                     */
                    _this.dragEndNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>nodeEditStarting</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>nodeEditStarting</b> Wijmo event name.
                     */
                    _this.nodeEditStartingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>nodeEditStarted</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>nodeEditStarted</b> Wijmo event name.
                     */
                    _this.nodeEditStartedNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>nodeEditEnding</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>nodeEditEnding</b> Wijmo event name.
                     */
                    _this.nodeEditEndingNg = new core_1.EventEmitter(false);
                    /**
                     * Angular (EventEmitter) version of the Wijmo <b>nodeEditEnded</b> event for programmatic access.
                     * Use this event name if you want to subscribe to the Angular version of the event in code.
                     * In template bindings use the conventional <b>nodeEditEnded</b> Wijmo event name.
                     */
                    _this.nodeEditEndedNg = new core_1.EventEmitter(false);
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
                WjTreeView.prototype.created = function () {
                };
                WjTreeView.prototype.ngOnInit = function () {
                    this._wjBehaviour.ngOnInit();
                };
                WjTreeView.prototype.ngAfterViewInit = function () {
                    this._wjBehaviour.ngAfterViewInit();
                };
                WjTreeView.prototype.ngOnDestroy = function () {
                    this._wjBehaviour.ngOnDestroy();
                };
                return WjTreeView;
            }(wjcNav.TreeView));
            WjTreeView.meta = {
                outputs: wjTreeViewMeta.outputs,
                changeEvents: {
                    'selectedItemChanged': ['selectedItem', 'selectedNode'],
                    'checkedItemsChanged': ['checkedItems']
                },
            };
            WjTreeView.decorators = [
                { type: core_1.Component, args: [{
                            selector: wjTreeViewMeta.selector,
                            template: wjTreeViewMeta.template,
                            inputs: wjTreeViewMeta.inputs,
                            outputs: wjTreeViewMeta.outputs,
                            providers: [
                                { provide: 'WjComponent', useExisting: core_2.forwardRef(function () { return WjTreeView; }) }
                            ].concat(wjTreeViewMeta.providers)
                        },] },
            ];
            /** @nocollapse */
            WjTreeView.ctorParameters = function () { return [
                { type: core_2.ElementRef, decorators: [{ type: core_3.Inject, args: [core_2.ElementRef,] },] },
                { type: core_2.Injector, decorators: [{ type: core_3.Inject, args: [core_2.Injector,] },] },
                { type: undefined, decorators: [{ type: core_3.Inject, args: ['WjComponent',] }, { type: core_3.SkipSelf }, { type: core_2.Optional },] },
            ]; };
            exports_1("WjTreeView", WjTreeView);
            moduleExports = [
                WjTreeView
            ];
            WjNavModule = (function () {
                function WjNavModule() {
                }
                return WjNavModule;
            }());
            WjNavModule.decorators = [
                { type: core_1.NgModule, args: [{
                            imports: [wijmo_angular2_directiveBase_1.WjDirectiveBaseModule, common_1.CommonModule],
                            declarations: moduleExports.slice(),
                            exports: moduleExports.slice(),
                        },] },
            ];
            /** @nocollapse */
            WjNavModule.ctorParameters = function () { return []; };
            exports_1("WjNavModule", WjNavModule);
        }
    };
});
//# sourceMappingURL=wijmo.angular2.nav.js.map