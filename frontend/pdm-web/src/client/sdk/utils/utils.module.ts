import { NgModule } from '@angular/core';
import { InjectorUtil } from './injector.util';
import { RestfulUtil } from './restful.util';
import { UnicodeUtil } from './unicode.util';
import { UUIDUtil } from './uuid.util';
import { DataUtil } from './data.util';
import { DateUtil } from './date.util';
import { NumberUtil } from './number.util';
import { ContextUtil } from './context.util';
import { ValidateUtil } from './validate.util';
import { FileUtil } from './file.util';
import { CodeUtil } from './code.util';

@NgModule({
    exports: []
})
export class UtilsModule {
    static forProviders(): any[] {
        return [
            InjectorUtil
        ];
    }
}

export const Util = {
	Data: DataUtil,
	Date: DateUtil,
	Number: NumberUtil,
	Restful: RestfulUtil,
	Unicode: UnicodeUtil,
	UUID: UUIDUtil,
    Context: ContextUtil,
    Validate: ValidateUtil,
    File: FileUtil,
    Code: CodeUtil
};
