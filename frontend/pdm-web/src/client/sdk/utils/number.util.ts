export class NumberUtil {

	static format(value: any, format: string = '') {
		if (value) return numeral(value).format(format);
		return value;
	}

	static tofixed(value: any, fixedNumber: number = 5): any {
		// TODO : value type 별 체크 로직 추가
		let returnValue: any = value;
		if (Number.isInteger(value)) {
			if (value == 0) {
				returnValue = value;
			} else {
				returnValue = value.toFixed(fixedNumber);
			}
		} else {
			returnValue = Number(value).toFixed(fixedNumber);
		}
		return returnValue;
	}

}
