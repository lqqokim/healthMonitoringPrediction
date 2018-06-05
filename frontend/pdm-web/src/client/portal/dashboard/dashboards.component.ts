import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: '[a3p-dashboards]',
    template: `
		<div class="float-wrapper">
			<dl>
                <dt>
                    <div class="a3-spinner">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                    </div>
                </dt>
                <dd class="message-title">Loading...</dd>
            </dl>
		</div>
    `
})
export class DashboardsComponent implements OnInit {

    ngOnInit() {
        // console.log('----DashboardsComponent init');
    }
}