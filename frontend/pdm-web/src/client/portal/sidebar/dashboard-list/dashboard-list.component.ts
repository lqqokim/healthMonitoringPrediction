import { Component, OnInit } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: '[a3p-sidebar-panel][a3p-dashboard-list]',
    template: '<div><div a3p-dashboard-list-content></div></div>'
})
export class DashboardListComponent implements OnInit {
    constructor() { }

    ngOnInit() { }
}