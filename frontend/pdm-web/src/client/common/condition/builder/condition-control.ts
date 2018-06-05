import { ConditionType } from '../condition.type';

export class ConditionControl {

	private _condition: ConditionType;

	constructor(conditionType: ConditionType) {
		this._condition = conditionType;
	}

	set conditions(conditionType: ConditionType) {
		this._condition = conditionType;
	}

	get conditions() {
		this._execute();
		return this._condition;
	}

	get name() {
		return this._condition.name;
	}

	get groupName() {
		return this._condition.groupName;
	}

	get formattedValue() {
		if (this._condition.formatter
			&& (typeof this._condition.formatter === 'function')) {
			return this._condition.formatter(this._condition.value);
		}
		return this._condition.value;
	}

	get fValue() {
		return this.formattedValue();
	}

	get value() {
		return this._condition.value;
	}

	set value(newValue: any) {
		this._condition.value = newValue;
	}

	get formatter() {
		return this._condition.formatter;
	}

	get i18n() {
		return this._condition.i18n;
	}

	get required() {
		return this._condition.required;
	}

	get type() {
		return this._condition.type;
	}

	get validator() {
		return this._condition.validator;
	}

    get invisibleName() {
        return this._condition.invisibleName;
    }

	private _execute() {
		// validation
		// formatting
		// i18n
	}
}
