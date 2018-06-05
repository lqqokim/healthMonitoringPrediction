export class CodeUtil {

    static getObject(list: any[], code: any): any {
		if (list.length == 0 || this.isEmpty(code)) {
			return {};
		}
        return _.where(list, {'code': code.toString()})[0];
    }	

    static getProperty(list: any[], code: any, property: string): any {
		if (list.length == 0 || this.isEmpty(code) || this.isEmpty(property)) {
			return '';
		}
        return _.where(list, {'code': code.toString()})[0][property];
    }	    

    static isEmpty(val: any) {
        return val === undefined || val === null || val === '';
    }  
  
}

