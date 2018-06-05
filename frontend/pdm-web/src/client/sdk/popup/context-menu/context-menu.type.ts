export interface ContextMenuType {
    tooltip?: TooltipType;
	template?: TemplateType;
    outCondition?: OutConditionType;
	contextMenuAction?: ContextMenuActionType;
    contextMenuOption?: ContextMenuOption;
}

export interface TooltipType {
    target?: any;
    event?: any;
    options?: any;
    eventType?: string;
    uid?: any;
    type?: string;
}

export interface TemplateType {
    title?: string;
    type?: string;
    data?: any;
    option?: any;
    action?: InternalActionType | InternalActionType[];
    innerHtml?: any;
}

export interface OutConditionType {
    data: any;
    syncCallback?: any;
}

export interface ContextMenuActionType {
    invisible?: boolean;
    disableCommnet?: boolean;
    invisibleComment?: boolean;
    disableAppList?: boolean;
    invisibleAppList?: boolean;
    disableDetailView?: boolean;
    invisibleDetailView?: boolean;
    disableSync?: boolean;
    invisibleSync?: boolean;
}

export interface InternalActionType {
    buttonStyle?: string;
    label?: string;
    labelI18n?: string;
    callback?: any;
    data?: any;
}

export interface ContextMenuOption {
    appListType?: string;
    detailViewCallback?: any;
}

/*
export interface ContextCustomDataType {
	list: ContextDataGroupsType[];
	indentType?: string;
}

export interface ContextDataGroupsType {
	title: string;
	groups: ContextDataGroupType[];
}

export interface ContextDataGroupType {
	name: string;
	value: string;
}
*/
