import { Component, Input, Output, OnChanges, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { FdcModelService, ModalApplier } from '../../../../../../../common';
import { Subscription } from 'rxjs/Subscription';
import { Translater, Util, NotifyService } from '../../../../../../../sdk';

@Component({
    moduleId: module.id,
    selector: 'import-modify',
    templateUrl: `./import-modify.html`,
    styleUrls: [`./import-modify.css`],
})
export class ImportModifyComponent implements OnChanges, OnDestroy {
    @Input() data: any;
    @Output() actionChanges = new EventEmitter();
    @ViewChild('fileImportInput') fileImportInput: any;

    headersRow: any;
    csvRecords: any = [];
    myData: any;
    selectedDatas;
    status: string;
    isSameName: boolean = false;
    isNameValid: boolean = true;
    gridData: any;
    selectAll: boolean = false;
    csvFilePath: string = '';
    importType: any = 'tool_module';    //'tool_module', 'external_module'
    reqData: any;
    errorColumns: Array<string> = [];

    private _selectedData: any;
    private _applier: ModalApplier;
    private _subscription: Subscription;

    constructor(
        private FdcPlusService: FdcModelService,
        private translater: Translater,
        private notify: NotifyService,
    ) { }

    ngOnChanges(changes: any): void {
        this.isSameName = false;
        this.isNameValid = true;

        if (changes && changes.data) {
            this._selectedData = changes.data.currentValue;
            this._applier = this._selectedData.applier;
            this._waitApply();
        }
    }

    _waitApply() {
        this._subscription = this._applier
            .listenApplyRequest()
            .subscribe((response) => {
                if (response.type === 'APPLY') {
                    this._importCategories();
                }
            });
    }

    _importCategories() {
        this.reqData = this._parsingCSVData(this.importType, this.headersRow, this.csvRecords);

        if (!this._validateImport()) {
            return;
        }

        this.FdcPlusService.paramcategoriesImport(this.reqData).subscribe((data: any) => {
            this._applier.appliedSuccess();
            this.notify.success('MESSAGE.APP_CONFIG.CATEGORY.IMPORT_SUCCESS');
        }, (err: Error) => {
            this._applier.appliedFailed();
            this.notify.error('MESSAGE.APP_CONFIG.CATEGORY.IMPORT_FAILT');
        }, () => {
            console.log('Completed import Categories...');
        });
    }

    _validateImport(): boolean {
        // 파일이 선택되지 않음
        if (!this.headersRow || !this.headersRow) {
            this.notify.error('MESSAGE.APP_CONFIG.CATEGORY.SELECT_FILE');
            return false;
        }
        // 필수 컬럼 체크
        if (this.errorColumns.length > 0) {
            const msg: any = this.importType === 'tool_module'
                ? 'MESSAGE.APP_CONFIG.CATEGORY.REQUIRE_COLUMN_TOOL'
                : 'MESSAGE.APP_CONFIG.CATEGORY.REQUIRE_COLUMN_EXTERNAL';
            this.notify.error(msg);
            return false;
        }
        // parsing된 데이터가 없을때
        if (this.reqData.length === 0) {
            this.notify.error('MESSAGE.APP_CONFIG.CATEGORY.IMPORT_NOTMATCH');
            return false;
        }
        return true;
    }

    onSelectionChange(event) {
        this.myData.modules = event;
    }

    validationMessage(type: string) {
        return this.translater.get('MESSAGE.APP_CONFIG.TOOLS.INPUT_VALID', { field: type })['value'];
    }

    input() {
        this.isNameValid = true;
        this.isSameName = false;
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

    fileChangeListener(ev: any) {
        console.log('fileChangeListener');
        let files = ev.srcElement.files;

        if (Util.File.isCSVFile(files[0])) {
            console.log('isCSVFile true');
            let input = ev.target;
            this.csvFilePath = input.files[0].name;
            let reader = new FileReader();
            reader.readAsText(input.files[0]);

            reader.onload = (data) => {
                let csvData = reader.result.trim();
                let csvRecordsArray;

                // delete white lines
                // for window
                while (csvData.indexOf('\r\n\r\n') !== -1) {
                    csvData = csvData.replace('\r\n\r\n', '\r\n');
                }
                // for rinux
                while (csvData.indexOf('\n\n') !== -1) {
                    csvData = csvData.replace('\n\n', '\n');
                }

                csvRecordsArray = csvData.split(/\r\n|\n/);

                this.headersRow = Util.File.getHeaderArray(csvRecordsArray);
                this.csvRecords = Util.File.getDataRecordsArrayFromCSVFile(csvRecordsArray, this.headersRow.length);
                // category 특수문자 체크
                // first : header에서 priorityCode index 가져옴.
                const categoryCodeIndex = this.headersRow[0].split(',').map(d => d.trim()).indexOf('priorityCode');
                let isValidateFormat = true;
                if (categoryCodeIndex > -1) {
                    //second : 해당 index의 값에 특수코드가 있는지 체크.
                    for (let i: number = 0; i < this.csvRecords.length; i++) {
                        let tempCode = this.csvRecords[i][0].split(',').map(d => d.trim())[categoryCodeIndex];
                        tempCode = tempCode.replace(/(^\s*)|(\s*$)/g, '');  //앞뒤공백제거..
                        const isNormalWord = this.checkStringFormat(tempCode);
                        if (!isNormalWord) {
                            isValidateFormat = false;
                            break;
                        }
                    }
                }
                if (!isValidateFormat) {
                    this.notify.error('MESSAGE.APP_CONFIG.CATEGORY.CANNOT_SPECIAL_CHARACTORS');
                    this.fileReset();
                }
            };

            reader.onerror = function () {
                alert('Unable to read ' + input.files[0]);
            };
        } else {
            this.notify.error('MESSAGE.APP_CONFIG.CATEGORY.SELECT_CSV');
            this.fileReset();
        }
    }

    fileReset() {
        this.fileImportInput.nativeElement.value = '';
        this.csvFilePath = '';
        this.csvRecords = [];
        this.headersRow = null;
        this.headersRow = null;
        this.errorColumns = [];
        this.reqData = [];
    }

    private checkStringFormat(string) {
        //const stringRegx=/^[0-9a-zA-Z가-힝]*$/;
        // const stringRegx = /[~!@\#$%<>^&*\()\-=+_\’]/gi;
        const stringRegx = /[₩~!@#$%<>^&*+=\\\'|`?/,."\[\]\{\}:;\-()]/gi;
        let isValid = true;
        if (stringRegx.test(string)) {
            isValid = false;
        }
        return isValid;
    }

    private _parsingCSVData(importType: any, headersRow: any, csvRecords: any) {
        let retData = [];
        if (headersRow && csvRecords) {
            if (importType === 'tool_module') {
                retData = this._parsingToolModule(headersRow, csvRecords);
            } else if (importType === 'external_module') {
                retData = this._parsingExternalModule(headersRow, csvRecords);
            }
        }
        return retData;
    }

    private _parsingToolModule(header: any, recodes: any) {
        let reqDatas = [];
        header = header[0].split(',').map(d => d.trim());

        const idx = {
            'toolName': header.findIndex((column: any) => column === 'toolName'),
            'moduleName': header.findIndex((column: any) => column === 'moduleName'),
            'extModuleId': -1,
            'variableId': header.findIndex((column: any) => column === 'variableId'),
            'paramName': header.findIndex((column: any) => column === 'paramName'),
            'paramAlias': header.findIndex((column: any) => column === 'paramAlias'),
            'priorityCode': header.findIndex((column: any) => column === 'priorityCode')
        };

        // 모든컬럼(requireColumns) 다 있는지 체크 하는 로직으로 수정
        //tool module 타입은 toolName 컬럼이 존재해야 함.
        // if (idx['toolName'] === -1) {
        //     return reqDatas;
        // }

        // require columns check
        this.errorColumns = this._checkRequireColumns(header);
        if (this.errorColumns.length > 0) {
            return reqDatas;
        }

        recodes.some((recode: any): any => {
            if (recode === '') return true;
            recode = recode[0].split(',').map(d => d.trim());

            const data = {
                'toolName': recode[idx['toolName']] || null,
                'moduleName': recode[idx['moduleName']] || null,
                'extModuleId': recode[idx['extModuleId']] || null,
                'variableId': recode[idx['variableId']] || null,
                'paramName': recode[idx['paramName']] || null,
                'paramAlias': recode[idx['paramAlias']] || recode[idx['paramName']],
                'priorityCode': recode[idx['priorityCode']] || A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code
            };

            const isDuplicateData = reqDatas.filter(((item: any) => {
                return item['toolName'] === data['toolName']
                    && item['moduleName'] === data['moduleName']
                    && item['paramAlias'] === data['paramAlias'];
            })).length > 0;

            if (!isDuplicateData) reqDatas.push(data);

            // header 개수와 데이터 개수 체크 다르면 빈 배열 리턴 후
            if (recode.length != header.length) {
                reqDatas = [];
                return true;
            }
        });

        return reqDatas;
    };

    private _checkRequireColumns(header: any): any {
        const tool: any = ['toolName', 'moduleName', 'variableId', 'paramName', 'paramAlias', 'priorityCode'];
        const external: any = ['moduleName', 'variableId', 'paramName', 'paramAlias', 'priorityCode'];
        const columns: any = this.importType === 'tool_module' ? tool : external;
        const errors: any = _.filter(columns, (column: string) => {
            return _.indexOf(header, column) === -1;
        });
        return errors;
    }

    private _parsingExternalModule(header: any, recodes: any) {
        let reqDatas = [];
        header = header[0].split(',').map(d => d.trim());

        const idx = {
            'toolName': header.findIndex((column: any) => column === 'toolName'),
            'moduleName': -1,
            'extModuleId': header.findIndex((column: any) => column === 'moduleName'),
            'variableId': header.findIndex((column: any) => column === 'variableId'),
            'paramName': header.findIndex((column: any) => column === 'paramName'),
            'paramAlias': header.findIndex((column: any) => column === 'paramAlias'),
            'priorityCode': header.findIndex((column: any) => column === 'priorityCode')
        };

        // 모든컬럼(requireColumns) 다 있는지 체크 하는 로직으로 수정
        //external 타입은 toolName 컬럼이 존재하지 않아야 함.
        // if (idx['toolName'] !== -1) {
        //     return reqDatas;
        // }

        // require columns check
        this.errorColumns = this._checkRequireColumns(header);
        if (this.errorColumns.length > 0) {
            return reqDatas;
        }

        recodes.some((recode: any): any => {
            if (recode[0] === '') return true;
            recode = recode[0].split(',').map(d => d.trim());
            const data = {
                'toolName': recode[idx['toolName']] || null,
                'moduleName': recode[idx['moduleName']] || null,
                'extModuleId': recode[idx['extModuleId']] || null,
                'variableId': recode[idx['variableId']] || null,
                'paramName': recode[idx['paramName']] || null,
                'paramAlias': recode[idx['paramAlias']] || recode[idx['paramName']],
                'priorityCode': recode[idx['priorityCode']] || A3_CODE.DFD.PARAMETER_NONE_PRIORITY.code
            };

            const isDuplicateData = reqDatas.filter(((item: any) => {
                return item['extModuleId'] === data['extModuleId']
                    && item['paramAlias'] === data['paramAlias'];
            })).length > 0;

            if (!isDuplicateData) reqDatas.push(data);

            // header 개수와 데이터 개수 체크 다르면 빈 배열 리턴 후
            if (recode.length != header.length) {
                reqDatas = [];
                return true;
            }
        });

        return reqDatas;
    };
}
