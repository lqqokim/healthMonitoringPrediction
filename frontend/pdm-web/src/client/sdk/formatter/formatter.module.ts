import { NgModule } from '@angular/core';
import { DateFormatter } from './date.formatter';
import { NumberFormatter } from './number.formatter';
import { LabelFormatter } from './label.formatter';

@NgModule({
    exports: []
})
export class FormatterModule {
  static forProviders() {
    return [
        DateFormatter,
        NumberFormatter,
        LabelFormatter
    ];
  }
}

export const Formatter = {
	Date: DateFormatter,
	Number: NumberFormatter,
  label: LabelFormatter
};
