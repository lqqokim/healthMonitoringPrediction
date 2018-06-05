export class DateFormatter {

	static format(value: any, format: string = 'MM/DD/YYYY HH:mm:ss'): any {
		// TODO : value type 별 체크 로직 추가
		if (value) return moment(value).format(format);
		return value;
	}

	static secondsFromMilli(seconds: number, format: string = '0,0'): any {
		if (seconds) {
			return numeral(seconds/1000).format(format);
		}
		return seconds;
	}

	static secondsAndMilli(milliseconds: number, format: string = '0,0.000'): any {
		if (milliseconds) {
			return numeral(milliseconds/1000).format(format);
		}
		return milliseconds;
	}

	static formatSecondsAsTime(seconds: number, fixedNumber: number = 5): any {
		let rv = '0';
		if (seconds) {
			rv = (Number(seconds) / 1000).toFixed(fixedNumber);
		}
		return rv;
	}
}
