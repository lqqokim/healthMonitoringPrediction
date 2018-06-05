export class UnicodeUtil {

    /*
    static unicode_substring(str: any, limit: number) {
        let tmpStr = str || '';
        let byte_count = 0;
        let len = tmpStr.length;

        for (let i = 0; i < len; i++) {
            byte_count += this.chr_byte(str.charAt(i));
            if (byte_count == limit - 1) {
                if (this.chr_byte(str.charAt(i + 1)) == 2) {
                    tmpStr = str.substring(0, i + 1);
                } else {
                    tmpStr = str.substring(0, i + 2);
                }
                break;
            } else if (byte_count == limit) {
                tmpStr = str.substring(0, i + 1);
                break;
            }
        }
        return tmpStr;
    }
    */

    static unicode_length(str: any): number {
        let value: string = str || '';
        let valueSize: number = value.length;
        let byteCount: number = 0;
        for (let i=0; i<valueSize; i++) {
            byteCount += UnicodeUtil.chr_byte(value.charAt(i));
        }
        return byteCount;
    }

    static unicode_substring(str: any, limit: number) {
        let tmpStr = str || '';
        let byte_count = 0;
        let next_count = 0;
        let curr_count = 0;
        let len = tmpStr.length;

        for (let i=0; i<len; i++) {
            byte_count += UnicodeUtil.chr_byte(str.charAt(i));
            next_count = UnicodeUtil.chr_byte(str.charAt(i+1));
            curr_count = byte_count + next_count;

            if (curr_count > limit) {
                tmpStr = str.substring(0, i + 1);
                break;
            }
            else if (curr_count == limit) {
                tmpStr = str.substring(0, i + 2);
                break;
            } else {
                tmpStr = str.substring(0, i + 1);
            }
        }

        return tmpStr;
    }

    static chr_byte(chr: any) {
        if (escape(chr).length > 4)
            return 3;
        else
            return 1;
    }

}

