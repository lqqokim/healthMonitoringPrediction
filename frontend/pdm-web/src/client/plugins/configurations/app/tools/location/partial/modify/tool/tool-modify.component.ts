import { Component, Input, OnChanges, OnInit } from '@angular/core';

import {
    ToolModelService,
    ModalApplier,
    ModalAction,
    ModalRequester,
    RequestType
} from '../../../../../../../../common';
import { NotifyService, Translater } from '../../../../../../../../sdk';

import { Subscription } from 'rxjs/Subscription';

@Component({
    moduleId: module.id,
    selector: 'tool-modify',
    templateUrl: `tool-modify.html`,
    providers: [ToolModelService]
})
export class ToolModifyComponent implements OnInit, OnChanges {

    @Input() data: any;
    @Input() status: string;
    @Input() isReadOnly: boolean;
    @Input() toolItem: any;

    locationTypes;
    locations;
    toolModels;
    toolModelVersions;
    toolGroups;
    locationName;
    myData;
    _toolCheck: string = 'tool';

    isNameValid: boolean = true;
    isGroupValid: boolean = true;
    isModelValid: boolean = true;
    isModelVerValid: boolean = true;

    validationMessages = {
        'name': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', { field: 'name' })['value'],
        },
        'toolModel': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.SELECT_VALID', { type: 'Model' })['value']
        },
        'toolModelVer': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.SELECT_VALID', { type: 'Model Version' })['value']
        },
        'toolGroup': {
            'required': this.translater.get('MESSAGE.APP_CONFIG.TOOLS.SELECT_VALID', { type: 'Tool Group' })['value']
        }
    };

    private _applier: ModalApplier;
    private _subscription: Subscription;
    private _selectedData: any;

    constructor(
        private eqpService: ToolModelService,
        private modalAction: ModalAction,
        private requester: ModalRequester,
        private notify: NotifyService,
        private translater: Translater
    ) { }

    ngOnInit() {

    }

    ngOnChanges(changes): void {
        if (changes && changes.data) {
            if (changes.data.currentValue.applier) {
                this._selectedData = changes.data.currentValue.tool;
                this._applier = changes.data.currentValue.applier;
                this.status = changes.data.currentValue.status;
                this._waitApply();
            } else {
                this._selectedData = changes.data.currentValue;
            }
            this._locationsSetting();
        }
    }

    _locationsSetting() {
        if (this.locationTypes === undefined) {
            this.eqpService.getLocationTypes().subscribe((locationTypes) => {
                this.locationTypes = locationTypes;
            });

            this.eqpService.getLocationList().subscribe((locations) => {
                this.locations = locations;
                this.getMyData();
            });

            this.eqpService.getToolModels().subscribe((models) => {
                this.toolModels = models;
            });

            this.eqpService.getToolGroups().subscribe((toolGroups) => {
                this.toolGroups = toolGroups;
            });
        } else {
            this.getMyData();
        }
    }

    _waitApply() {
        this._subscription = this._applier.listenApplyRequest().subscribe((response) => {
            if (response.type === 'APPLY') {
                this.onClickSave('create');
            }
        });
    }

    getMyData() {
        if (this._selectedData !== undefined && this._selectedData.toolId !== undefined) {
            this.eqpService.getTool(this._selectedData.toolId).subscribe((datas) => {
                this.myData = datas[0];
                this.getLocationName();
            });
            this.changeToolModelId(this._selectedData.toolModelId);
        } else if (this._selectedData !== undefined && this._selectedData.locationId !== undefined && this.status === 'create') {
            this.myData = {};
            this.getLocationName();
        }
    }

    getLocationName() {
        this.myData.locationId = this._selectedData.locationId;
        for (let i = 0; i < this.locations.length; i++) {
            if (this.locations[i].locationId === this._selectedData.locationId) {
                for (let j = 0; j < this.locationTypes.length; j++) {
                    if (this.locationTypes[j].locationTypeId === this.locations[i].locationTypeId) {
                        this.locationName = this.locationTypes[j].name;
                        break;
                    }
                }
                break;
            }
        }
    }

    changeToolModelId(modelId) {
        this.eqpService.getToolModelVersions(modelId).subscribe((modelVersions) => {
            this.toolModelVersions = modelVersions;
        });
    }

    onClickSave(status: string, callback?: any) {
        this.isNameValid = this.isValid(this.myData['name']);
        this.isModelValid = this.isValid(this.myData['toolModelId']);
        this.isModelVerValid = this.isValid(this.myData['toolModelVerId']);
        this.isGroupValid = this.isValid(this.myData['toolGroupId']);

        if (status !== 'delete') {
            if (!this.isNameValid || !this.isModelValid || !this.isModelVerValid || !this.isGroupValid) {
                return;
            }
        }

        this.status = status;
        this.myData.used = this.myData['used_TF'] === true ? 'Y' : 'N';
        this.myData.batchEqp = this.myData['batchEqp_TF'] === true ? 'Y' : 'N';
        if (this.status === 'create') {
            this.eqpService.createTool(this.myData).subscribe( // Select Area
                (data) => {
                    this._applier.appliedSuccess();
                },
                (error) => {
                    this._applier.appliedFailed();
                    console.log('Error HTTP POST Service', error);
                });
        } else if (this.status === 'modify') {
            this.eqpService.modifyTool(this.myData).subscribe(
                (data) => {
                    if (callback !== undefined) {
                        callback('success');
                    }
                    this.notify.success("MESSAGE.USER_CONFIG.UPDATE_SUCCESS");
                },
                (error) => {
                    console.log('Error HTTP PUT Service', error);
                });
        } else if (this.status === 'delete') {
            this._deleteAction(callback);
        }
    }

    _deleteAction(callback) {
        this.modalAction.showConfirmDelete({
            info: {
                title: this.myData.name,
                // confirmMessage: `${this.myData.name}를 삭제하시겠습니까?`,
                 confirmMessage: this.translater.get('MESSAGE.APP_CONFIG.TOOLS.REMOVE_ITEM', { itemName: this.myData.name })['value'],
           },
            requester: this.requester
        });

        this.requester.getObservable().subscribe((response: RequestType) => {
            if (response.type === 'OK' && response.data) {
                // this.onClickSave('delete');
                this._deleteSelectedTool(callback);
            }
        });
    }

    _deleteSelectedTool(callback) {
        this.eqpService.deleteTool(this.myData).subscribe(
            (data) => {
                if (callback !== undefined) {
                    callback('success');
                }
                //TODO: MESSAGE
                this.notify.success("MESSAGE.USER_CONFIG.REMOVE_SUCCESS");
            },
            (error) => {
                console.error('Error HTTP DELETE Service', error);
                this.notify.error('MESSAGE.GENERAL.ERROR');
            });
    }

    input(event) {
        const targetId = event.target.id;
        if (targetId === 'inputName') {
            this.isNameValid = true;
        } else if (targetId === 'inputModelName') {
            this.isModelValid = true;
        } else if (targetId === 'inputModelVersion') {
            this.isModelVerValid = true;
        } else if (targetId === 'inputGroup') {
            this.isGroupValid = true;
        }
    }

    isValid(isValid) {
        if (isValid === undefined || isValid === null || isValid === '') {
            return false;
        } else {
            return true;
        }
    }

    ngOnDestroy() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
    }
}
