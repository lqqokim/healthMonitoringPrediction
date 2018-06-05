import { NgModule } from '@angular/core';
import { BoxplotConfig } from "./boxplot-config";
import { ScatterplotConfig } from "./scatterplot-config";

@NgModule({
    exports: []
})
export class ChartConfigModule {
  static forProviders() {
    return [
        BoxplotConfig,
        ScatterplotConfig
    ];
  }
}

export const ChartDefaultConfig = {
	Boxplot: BoxplotConfig,
  Scatterplot: ScatterplotConfig
};