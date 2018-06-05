import { NgModule } from '@angular/core';
import { C3ChartComponent } from './c3-chart.component';
import { BistelChartComponent } from './bistel-chart.component';
import { CommonChartComponent } from './common-chart.component';
import { SpinnerModule } from '../../popup/spinner/spinner.module';
import { CommonModule } from "@angular/common";

@NgModule({
	imports: [
		SpinnerModule
	],
	declarations: [
		CommonChartComponent,
		BistelChartComponent,
		C3ChartComponent
	],
	exports: [
		CommonChartComponent,
		BistelChartComponent,
		C3ChartComponent
	]
})
export class ChartsModule {}
