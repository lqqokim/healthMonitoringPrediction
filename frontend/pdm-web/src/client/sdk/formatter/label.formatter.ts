export class LabelFormatter {

	static display_name( value: any, key: string = 'name' ): any {
		if (value) return value[key];
		return value;
	}

}