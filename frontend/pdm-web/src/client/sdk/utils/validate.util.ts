export class ValidateUtil {

    static isEmpty(val: any) {
        return val === undefined || val === null;

    }

    static default(val: any, defaultVal: any) {
        return this.isEmpty(val) || (Array.isArray(val) && val.length == 0) ? defaultVal :  val;
    }

}

