export interface ConditionType {
	name: string;
	isGroup?: boolean;
	value?: any;
	type?: string;
	required?: boolean;
	formatter?: any;
	i18n?: string;
	validator?: any;
	// search value in groupKey
	groupName?: string;
    invisibleName?: boolean;
}

export interface ConditionValueType {
	isGroup?: boolean;
	value?: any;
	type?: string;
	required?: boolean;
	formatter?: any;
	i18n?: string;
	validator?: any;
	// search value in groupKey
	groupName?: string;
	invisibleName?: boolean;
	config? :any;
}

