import {
    Injectable, ViewContainerRef, ComponentRef,
    ComponentFactoryResolver
} from "@angular/core";
import { ContextMenuModel, ContextMenuWidgetComponent, ContextMenuTemplateInfo, ContextMenuRequester } from "../../common";
import { ContextMenuService } from "../../sdk";

@Injectable()
export class BehaviorService {

    private _usedContextMenuModel: ContextMenuModel;

    usedContextMenu: ComponentRef<any>;
    usedSubContextMenu: ComponentRef<any>;
    contextMenus: Map<number, any>;
    currnetTarget: any;
    currentApi: any;

	constructor(
		private compiler: ComponentFactoryResolver,
		private contextMenuService: ContextMenuService
	) {
        this.contextMenus = new Map<number, any>();
    }

	showContext(cm: ContextMenuModel, container: ViewContainerRef) {
        this._destroyDynamicComponent();
		this._getDynamicContext(cm, container).then((result: any) => {
			let component: ComponentRef<any> = result;
			let instance: any = component.instance;
            let config = this._contextMenuModelToConfig(cm);
			// let config2 = {
			// 	type: cm.tooltip.type,
            //     requester: cm.requester,
			// 	event: cm.tooltip.event,
            //     eventType: cm.tooltip.eventType,
			// 	target: cm.tooltip.target,
			// 	options: cm.tooltip.options || {},
			// 	element: instance.getEl()
			// };
			// // content 설정
			config.options.content = {text: instance.getEl()};
            // context menu api
			let api = this.contextMenuService.openContextMenu(config);
			// context menu instance add
            this.contextMenus.set(cm.id, api);
            // open Context Menu
            this._openContext(api);
		})
	}

    private _contextMenuModelToConfig(cm: ContextMenuModel): any {
        return {
            type: cm.tooltip.type,
            requester: cm.requester,
            event: cm.tooltip.event,
            eventType: cm.tooltip.eventType,
            target: cm.tooltip.target,
            options: cm.tooltip.options || {}
        };
    }

	private _openContext(api: any) {
        this.currentApi = api;
        setTimeout(() => {
            if (!api.disabled) {
                api.show();
            }
        }, 50);
    }

    closeContext(action: ContextMenuModel) {
        this._destroyDynamicComponent();
        if (this.currentApi) {
            this.currentApi.hide();
            this.currentApi.disabled = true;
        }
    }

    private _getDynamicContext(cm: ContextMenuModel, container: ViewContainerRef) {
        if (cm.tooltip.type === A3_CONFIG.TOOLTIP.TYPE.CHART) {
            return this._getChartContext(cm, container);
        }
        else {
            return this._getCommonContext(cm, container);
        }
	}

    private _getCommonContext(action: ContextMenuModel, container: ViewContainerRef) {
		let promise = new Promise((resolve, reject) => {
			this._createTemplate(action, container).then(
                (contextRef: ComponentRef<any>) => {
                    this.usedContextMenu = contextRef;
                    resolve(contextRef);
                }
            )
		});
		return promise;
	}

    private _getChartContext(action: ContextMenuModel, container: ViewContainerRef) {
		let promise = new Promise((resolve, reject) => {
			this._createTemplate(action, container, ContextMenuWidgetComponent).then(
				(contextRef: ComponentRef<any>) => {
                    this.usedContextMenu = contextRef;
					this._createTemplate(action, contextRef.instance.contentView).then(
						(subContextRef: ComponentRef<any>) => {
                            this.usedSubContextMenu = subContextRef;
							resolve(contextRef);
						}
					)
				}
			);
		});
		return promise;
	}

    private _createTemplate(action: ContextMenuModel, container: ViewContainerRef, defaultTemplate: any = null) {
        let promise = new Promise((resolve, reject) => {
            let componentType: any = defaultTemplate || ContextMenuTemplateInfo.getTemplate(action.template.type);
            let factory: any = this.compiler.resolveComponentFactory(componentType)
            let component = container.createComponent(factory, 0, container.injector);
            let instance: any = component.instance;
            instance.setConfig(action);
            resolve(component);
        });
        return promise;
	}

    private _isCurrentTarget(cm: ContextMenuModel) {
        let eventTarget: any = cm.tooltip.event.target;
        let target: any = eventTarget ? eventTarget : cm.tooltip.target;
        if (target && target != this.currnetTarget) {
            this.currnetTarget = target;
            return false;
        }
        return true;
    }

    private _destroyDynamicComponent() {
        if (this.usedContextMenu) {
            this.usedContextMenu.destroy();
            this.usedContextMenu = null;
        }
        if (this.usedSubContextMenu) {
            this.usedSubContextMenu.destroy();
            this.usedSubContextMenu = null;
        }
    }
}
