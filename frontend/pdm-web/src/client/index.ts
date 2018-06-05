import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { SpinnerConstant } from './sdk';
import {
	ActionTypeConstant,
	ConditionConstant,
	LabelConstant,
	WidgetConstant,
	TaskerConstant
} from './common';
import { A3_PortalModule } from './portal';
import { getA3ConfigConstant, getA3CodeConstant, A3ConfigConstant, getMyJSON } from './a3-config';

// set global object for constants
(<any>window).ActionType = ActionTypeConstant;
(<any>window).SPINNER = SpinnerConstant;
(<any>window).CD = ConditionConstant;
(<any>window).LB = LabelConstant;
(<any>window).A3_WIDGET = WidgetConstant;
(<any>window).A3_TASKER = TaskerConstant;

//CI style for Mac
if (window.navigator.userAgent.indexOf('Mac') !== -1) {
	var html = document.getElementById('mip_html');
	html.className += ' mac';
}

/**
 * assets/config/a3-config-runtime.json파일을 읽은후 애플리케이션을 부팅한다.
 */
getA3ConfigConstant()
	.success((response) => {
		const config = Object.assign(A3ConfigConstant, response);
		// console.log('>> A3 Config\n', config);
		(<any>window).A3_CONFIG = config;

		// performance tuning
		enableProdMode();

		// Compile and launch the module
		platformBrowserDynamic().bootstrapModule(A3_PortalModule);
	}).fail(() => console.log('Unable to read ACubed Configuaration file <%=A3_CONFIGURATION%>. Please check configuration file!'));

getA3CodeConstant()
	.success((response) => {
		const code = response;
		// console.log('>> A3 Code\n', code);
		(<any>window).A3_CODE = code;

	}).fail(() => console.log('Unable to read ACubed Configuaration file <%=A3_CODE%>. Please check configuration file!'));



