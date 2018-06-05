import { Component, Input, Output, OnChanges, OnInit, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserModelService } from '../../../../../../common';

@Component({
    moduleId: module.id,
    selector: 'role-permission',
    templateUrl: 'role-permission.html',
    styleUrls: ['role-permission.css'],
    providers: [UserModelService]

})
export class RolePermissionComponent implements OnInit, OnChanges {
    @Input() status: string;
    @Output() selectChange = new EventEmitter();
    @Input() data: any;
    @Input() edit: boolean = true;

    dataRole: any;
    roles: any[] = [];
    selectedRoleData: string;
    selectedChildRoleData: string;
    selectCondition: string;
    permissions = [];
    objIdOperNamesPermission = {};
    objIdsPermission = {};
    parentIdsChildPermission = {};
    disabledItems = [];

    conditions: string[] = ['ALL', 'AREA=PHOTO', 'AREA=ETCH'];
    headers: any[] = [
        { id: 'menu', display: 'Menu' },
        { id: 'FUNCTION_ALL', display: 'All' },
        { id: 'function', display: 'Function' },
        { id: 'ACTION_ALL', display: 'All' },
        { id: 'VIEW', display: 'View' },
        { id: 'CREATE', display: 'Create' },
        { id: 'MODIFY', display: 'Modify' },
        { id: 'DELETE', display: 'Delete' }
    ];

    private permissionHasError: boolean = false;

    constructor(private userService: UserModelService) { }

    ngOnInit() {

        this.dataRole = {};

        this.userService.getPermissions().subscribe((permissions) => {
            //console.log('getPermissions',permissions.length.toString());
            try {
                let headerCount = 0;
                for (let i = 0; i < permissions.length; i++) {
                    //console.log('Permissions For',i);
                    let action = {
                        menu: { name: '', id: '', use: false },
                        'FUNCTION_ALL': { name: '', id: '', use: false, checked: false },
                        'function': { name: '', id: '', use: false },
                        'ACTION_ALL': { name: '', id: '', use: false, checked: false },
                        'VIEW': { name: '', id: '', use: false, checked: false },
                        'CREATE': { name: '', id: '', use: false, checked: false },
                        'MODIFY': { name: '', id: '', use: false, checked: false },
                        'DELETE': { name: '', id: '', use: false, checked: false }
                    };
                    for (let j = 0; j < permissions[i].operations.length; j++) {
                        // console.log('Permissions[i].operations For',j);
                        let operation: string = permissions[i].operations[j].operationName;
                        if (action[operation] == undefined) {
                            let fieldNum = Object.keys(action).length - 8;
                            action['Field' + fieldNum] = { name: '', id: '' };
                            action['Field' + fieldNum].name = operation;
                            action['Field' + fieldNum].id = permissions[i].operations[j].operationId;
                            action['Field' + fieldNum].use = true;
                            action['Field' + fieldNum].enabled = true;
                            action['Field' + fieldNum]['objectId'] = permissions[i].objectId;
                            action['Field' + fieldNum]['objectOperationId'] = permissions[i].operations[j].objectOperationId;
                            headerCount++;
                            this.objIdOperNamesPermission[permissions[i].objectId + ":" + permissions[i].operations[j].operationName] = action['Field' + fieldNum];
                            if (this.objIdsPermission[permissions[i].objectId] == undefined) this.objIdsPermission[permissions[i].objectId] = [];
                            this.objIdsPermission[permissions[i].objectId].push(action['Field' + fieldNum]);
                            if (permissions[i].parentId != null) {
                                if (this.parentIdsChildPermission[permissions[i].parentId] == undefined) this.parentIdsChildPermission[permissions[i].parentId] = [];
                                this.parentIdsChildPermission[permissions[i].parentId].push(action['Field' + fieldNum]);
                            }
                        } else {
                            action[operation].use = true;
                            action[operation].name = operation;
                            action[operation].id = permissions[i].operations[j].operationId;
                            action[operation]['objectId'] = permissions[i].objectId;
                            action[operation]['objectOperationId'] = permissions[i].operations[j].objectOperationId;
                            action[operation].enabled = true;
                            this.objIdOperNamesPermission[permissions[i].objectId + ":" + permissions[i].operations[j].operationName] = action[operation];
                            if (this.objIdsPermission[permissions[i].objectId] == undefined) this.objIdsPermission[permissions[i].objectId] = [];
                            this.objIdsPermission[permissions[i].objectId].push(action[operation]);
                            if (permissions[i].parentId != null) {
                                if (this.parentIdsChildPermission[permissions[i].parentId] == undefined) this.parentIdsChildPermission[permissions[i].parentId] = [];
                                this.parentIdsChildPermission[permissions[i].parentId].push(action[operation]);
                            }
                        }
                    }
                    if (permissions[i].objectLevel == "1") {
                        action.menu.name = permissions[i].objectName;
                        action.menu.id = permissions[i].objectId;
                    } else {
                        action.function.name = permissions[i].objectName;
                        action.function.id = permissions[i].objectId;
                    }
                    this.permissions.push(action);

                }

                //console.log('Permissions For End');

                for (let i = 0; i < headerCount; i++) {
                    // console.log('headerCount',i);
                    let headName = "Field" + (i);
                    let displayName = "Field" + (i + 1);
                    this.headers.push({ "id": headName, "display": displayName });
                }
                //console.log('headerCount End');
                this.dataReduce();
            } catch (e) {
                console.log(e);
            }

        });
    }

    ngOnChanges(changes): void {
        this.permissionHasError = false;

        if (this.data != undefined) {
            this.dataReduce();
        }
    }

    dataReduce() {
        // console.log(this.objIdsPermission);
        let keys = Object.keys(this.objIdsPermission);
        let objs = [];

        for (let i = 0; i < keys.length; i++) {
            let data: any = this.objIdsPermission[keys[i]];
            for (let j = 0; j < data.length; j++) {
                data[j].checked = false;
            }
        }

        for (let i = 0; i < this.disabledItems.length; i++) {
            this.disabledItems[i].enabled = true;
        }
        this.disabledItems = [];
        // console.log('dataReduce', this.data);
        if (this.data != undefined && this.data.object != undefined) {
            for (let iObj = 0; iObj < this.data.object.length; iObj++) {
                let originKey = this.data.object[iObj].id;
                let currentKey = originKey;
                try {
                    // console.log("currentKey : ", currentKey);
                    if (this.data.object[iObj].operation.functionAll) {
                        currentKey += ":FUNCTION_ALL";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    if (this.data.object[iObj].operation.actionAll) {
                        currentKey += ":ACTION_ALL";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    if (this.data.object[iObj].operation.create) {
                        currentKey += ":CREATE";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    if (this.data.object[iObj].operation.modify) {
                        currentKey += ":MODIFY";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    if (this.data.object[iObj].operation.delete) {
                        currentKey += ":DELETE";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    if (this.data.object[iObj].operation.view) {
                        currentKey += ":VIEW";
                        this.objIdOperNamesPermission[currentKey].checked = true;
                    }
                    for (var i = 0; i < this.data.object[iObj].operation.actionExt.length; i++) {
                        this.objIdOperNamesPermission[originKey + ":" + this.data.object[iObj].operation.actionExt[i].name].checked = true;
                    }
                    
                } catch (e) {
                    // console.log(e);
                }
            }
            this.onClick();
        }
    }


    checkboxVisible(value, headId) {
        try {
            if (value[headId].use != undefined && headId.indexOf('Field') >= 0) {
                return false;
            }
            if (value[headId].use == true) {
                return false;
            }
            return true;

        } catch (e) {
            //console.log(e);
            return true;
        }
    }

    labelVisible(headId): any {
        try {
            if (headId == "menu" || headId == "function" || headId.indexOf('Field') >= 0)
                return false;
            return true;
        } catch (e) {
            //console.log(e);
        }
    }

    displayName(value) {
        if (value != undefined)
            return value.name;
        else return "";
    }
    
    tdVisible(value, headId) {
        if (headId.indexOf('Field') >= 0 && (value == null || value['name'] == undefined)) return false;
        return true;
    }

    onClick() {

        this.checkHierarchy();
        let keys = Object.keys(this.objIdOperNamesPermission);
        let objs = [];
        for (let i = 0; i < keys.length; i++) {
            let data = this.objIdOperNamesPermission[keys[i]];
            if (data.checked)
                objs.push({ objectOperationId: data.objectOperationId, objectId: data.objectId, operationId: data.id });
        }

        this.selectChange.emit({
            value: objs
        })
    }
    checkHierarchy() {

        this.disabledItems.forEach(element => {
            element.enabled = true;
        });
        this.disabledItems = [];

        //All Check
        if (this.objIdsPermission["1"] != undefined && this.objIdsPermission["1"].length > 0 && this.objIdsPermission["1"][0].checked) {
            let keys = Object.keys(this.objIdOperNamesPermission);
            let objs = [];
            for (let i = 0; i < keys.length; i++) {
                let data = this.objIdOperNamesPermission[keys[i]];
                data.checked = false;
                data.enabled = false;
                this.disabledItems.push(data);
            }
            this.objIdsPermission["1"][0].enabled = true;
            this.objIdsPermission["1"][0].checked = true;
            return;
        }

        let keys = Object.keys(this.objIdsPermission);
        for (let i = 0; i < keys.length; i++) {
            let data = this.objIdsPermission[keys[i]];
            let permissionFunctionAll = this.objIdOperNamesPermission[keys[i] + ":FUNCTION_ALL"];
            let permissionActionAll = this.objIdOperNamesPermission[keys[i] + ":ACTION_ALL"];
            if (permissionFunctionAll != undefined && permissionFunctionAll.checked) { //Function All Check
                for (let j = 0; j < data.length; j++) {
                    if (data[j].name != 'FUNCTION_ALL') {
                        //    data[j].checked = false;
                        //    data[j].enabled = false;
                        //    this.disabledItems.push(data[j]);
                    }
                }

                if (this.parentIdsChildPermission[keys[i]] != undefined) {
                    let childs = this.parentIdsChildPermission[keys[i]];
                    for (let j = 0; j < childs.length; j++) {
                        childs[j].checked = false;
                        childs[j].enabled = false;
                        this.disabledItems.push(childs[j]);
                    }
                }
            }
            //}else if(permissionActionAll!=undefined && permissionActionAll.checked){ //Action All Check
            if (permissionActionAll != undefined && permissionActionAll.checked) { //Action All Check               
                for (let j = 0; j < data.length; j++) {
                    if (data[j].name != 'FUNCTION_ALL' && data[j].name != 'ACTION_ALL') {
                        data[j].checked = false;
                        data[j].enabled = false;
                        this.disabledItems.push(data[j]);
                    }
                }
            }
        }
    }
}
