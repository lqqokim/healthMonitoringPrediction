export class NumberFormatter {

	static format(value: any, format: string = ''): any {
		if (value) return numeral(value).format(format);
		return value;
	}

}
