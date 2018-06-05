export class DataUtil {

	static selectedItemByKey(data: any, key: string, value: string): any {
		let item: any = null;
		if (data === null || data.length === 0) return item;
		data.forEach((d: any, i: number): any => {
			if (d[key] === value) {
				item = d;
				return false;
			}
		});
		return _.clone(item);
	}

	static filterByKey(data: any, key: string, value: any): any {
		let items: any[] = [];
		if (data === null || data.length === 0) return items;
		items = _.filter(data, (d: any): any => {
			if (value instanceof Array) return _.indexOf(value, d[key]) > -1;
			return d[key] == value;
		});
		return _.clone(items);
	}

	static isEnoughCondition(obj: any, keys: string[]) {
		// widget 공통에서 처리 예정
		return true;
	}

	/**
	 * Simple is object check.
	 * @param item
	 * @returns {boolean}
	 */
	static isObject(item: any): boolean {
		return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
	}

	/**
	 * Deep merge two objects.
	 * @param target
	 * @param source
	 */
	static mergeDeep(target: any, source: any): any {
		return $.extend(true, target, source);
	}

	static getValueFromJson(name: string, json: any): any {
		let value: any = json[name];
		if (value) { return value; }

		for (const key in json) {
			if (json.hasOwnProperty(key)) {
				if (key === name) {
					value = json[key];
					return;
				}
				else if (DataUtil.isObject(json[key])) {
					value = DataUtil.getValueFromJson(name, json[key]);
					return;
				}
			}
		}
		return value;
	}

	static setValueToJson(name: string, value: string, json: any) {
		for (const key in json) {
			if (json.hasOwnProperty(key)) {
				if (key === name) {
					json[key] = value;
					return;
				}
				else if (DataUtil.isObject(json[key])) {
					DataUtil.setValueToJson(name, value, json[key]);
				}
			}
		}
	}

	static nvl(value: any, defaulValue: any = ''): any {
		if (DataUtil.isNull(value)) {
			return defaulValue;
		}
		return value;
	}

	static isNull(value: any): boolean {
		if (_.isNull(value) || _.isUndefined(value)) {
			return true;
		}
		return false;
	}

	static isNotNull(value: any): boolean {
		if (_.isNull(value) || _.isUndefined(value)) {
			return false;
		}
		return true;
	}

	static setCookie(key: string, value: string, exdays: number = 1) {
		const d = new Date();
		d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
		const expires = "expires=" + d.toUTCString();
		document.cookie = key + "=" + value + ";" + expires + ";path=/";
	}

	static getCookie(key: string) {
		var name = key + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return undefined;
	}

	static removeCookie(key: string) {
		document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
	}

	static replaceRegexp(value: string, pattern: any, replaceValue: string = '') {
        if (pattern.test(value)){
            value = value.replace(pattern, replaceValue);
        }
        return value;
    }

    static findIndex(data: any, field: string, value: any): number {
        let index: number = -1;
        if (!data) return index;
        data.forEach((d: any, i: number) => {
            if (d[field] === value) index =  i;
        });
        return index;
    }

    static findItem(data: any, field: string, value: any): any {
        let result: any = null;
        if (!data) return result;
        data.forEach((d: any, i: number) => {
            if (d[field] === value) result = d;
        });
        return result;
    }

    static sampleData(size: number, labelField: string = 'label', dataField: string = 'data'): any {
        const data = [];
        for (let i=0; i<size; i++) {
            data.push({[labelField]: labelField+i, [dataField]: dataField+i});
        }
        return data;
    }

    static object2Array(value: any): Array<any> {
        const isArray: boolean = value instanceof Array;
        const data = isArray ? value : [value];
        return data;
    }

    static whiteSpace2null(value: string, defaultValue: any = null): any {
	    if (!value) {
	        return defaultValue;
        }
	    if (value.replace(/\s/g,'').length === 0) {
	        return defaultValue;
        }
        return value;
    }
}

