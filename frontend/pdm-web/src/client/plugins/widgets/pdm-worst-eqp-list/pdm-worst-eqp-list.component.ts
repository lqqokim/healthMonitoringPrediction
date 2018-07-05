import { Component, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { WidgetRefreshType, WidgetApi, OnSetup } from '../../../common';
import { Translater } from '../../../sdk';
import { PdmWostEqpListService } from './pdm-worst-eqp-list.service';
import { PdmCommonService } from '../../../common/service/pdm-common.service';
import { IWorstEeqList, ITimePeriod } from '../../common/status-chart-canvas/status-change.component';

//* ng2-tree Interface
// import { TreeModel } from 'ng2-tree';

@Component({
    moduleId: module.id,
    selector: 'pdm-worst-eqp-list',
    templateUrl: 'pdm-worst-eqp-list.html',
    styleUrls: ['pdm-worst-eqp-list.css'],
    providers: [PdmWostEqpListService, PdmCommonService],
    encapsulation: ViewEncapsulation.None
})

export class PdmWostEqpListComponent extends WidgetApi implements OnSetup, OnDestroy, AfterViewInit {

    drawColors:Array<any> = [
        {name:'run', color:'#1b6bce'},
        {name:'normal', color:'#00b050'},
        {name:'warning', color:'#ffc000'},
        {name:'alarm', color:'#ff0000'},
        {name:'failure', color:'#000000'},
        {name:'offline', color:'#a6a6a6'}
    ];

    private timePeriod: ITimePeriod = {
        fromDate : 1532044800000, // new Date(2018, 6, 20, 09, 0, 0, 0).getTime(),
        toDate : 1532077200000 // new Date(2018, 6, 20, 18, 0, 0, 0).getTime()
    };

    private targetName: string = 'All Lines';

    private listData: Array<IWorstEeqList> = [];

    private condition: {
        fabId: string;
        timePeriod: ITimePeriod
    };
    
    // TODO: Contour chart disable
    constructor(
        private dataSvc: PdmWostEqpListService,
        private translater: Translater,
        private _service: PdmWostEqpListService
    ){
        super();
    }

    ngOnSetup() {
        this.showSpinner();
        this.init();
        // this.hideSpinner();
    }

    private init(){
        this._setConfigInfo( this.getProperties() );
    }

    _setConfigInfo(props: any): void {
        console.log( props );
        // const now: Date = new Date();
        // const currDate: Date = new Date(now.getFullYear(), now.getMonth()+1, now.getDate());
        // const startOfDay: Date = new Date( currDate.getTime() - 86400000); // 1000 * 60 * 60 * 24 * 1 (1일)
        // const to: number = startOfDay.getTime(); // today 00:00:00

        this.condition = {
            fabId: props.plant.fabId,
            timePeriod: this.timePeriod
        };

        this.timePeriod.fromDate = props[CD.TIME_PERIOD].from;
        this.timePeriod.toDate = props[CD.TIME_PERIOD].to;

        this.getData();
    }

    /**
     * TODO
     * refresh 3가지 타입에 따라서 data를 통해 적용한다.
     *  justRefresh, applyConfig, syncInCondition
     */
    // tslint:disable-next-line:no-unused-variable
    refresh({ type, data }: WidgetRefreshType) {
        this.showSpinner();
        if (type === A3_WIDGET.APPLY_CONFIG_REFRESH) {
            this._setConfigInfo(data);
        } else if (type === A3_WIDGET.JUST_REFRESH) {
        
        } else if (type === A3_WIDGET.SYNC_INCONDITION_REFRESH) {
            this.hideSpinner();
            console.log('WORST EQP SYNC', data);
        }
    }

    ngAfterViewInit() {
        // this.shopGrid.selectedItems.splice(0);
        // this.hideSpinner()
    }

    ngOnDestroy() {
        this.destroy();
    }

    getData(){
        this._service.getListData({
            fabId: this.condition.fabId,
            areaId: '200',
            fromDate: this.timePeriod.fromDate,
            toDate: this.timePeriod.toDate
        }).then((res: any)=>{
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            let i: number,
                max: number = res.length,
                row: {
                    eqp_name: string;
                    eqp_rawid: number,
                    score: number,
                    area_rawid: number,
                    area_name: string,
                    datas: Array<{
                        type: string;
                        start: number;
                        end: number;
                    }>
                }
            ; 

            for( i=0; i<max; i++ ){
                row = res[i];
                this.listData.push({
                    order: i+1,
                    equipment: row.eqp_name,
                    score: row.score,
                    status: row.datas
                });
            }
            
            // 임시 세팅용 (서버 요청이 정상 데이터가 전달 된다면 아래 timeperiod 제거)
            this.timePeriod = {
                fromDate: 1527174000000,
                toDate: 1527260400000
            };

            console.log('result', res);
            console.log('this.listData', this.listData);

            this.hideSpinner();
        },(err: any)=>{

            // 에러 상황에도 임시로 출력 할수 있게 세팅 (서버 데이터가 정상적으로 온다면 제거할 것)
            if( this.listData.length ){
                this.listData.splice(0, this.listData.length);
            }

            this.timePeriod = {
                fromDate: 1532044800000,
                toDate: 1532077200000
            };

            this.listData = [
                {
                    order: 1,
                    equipment: 'EQP34',
                    score: 0.83,
                    status: [
                        {type: 'run', start:1532044800000, end:1532051940000 },
                        {type: 'normal', start:1532051940000, end:1532052000000 },
                        {type: 'warning', start:1532052000000, end:1532061011000 },
                        {type: 'alarm', start:1532061011000, end:1532066400000 },
                        {type: 'failure', start:1532066400000, end:1532073600000 },
                        {type: 'offline', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 2,
                    equipment: 'EQP51',
                    score: 0.75,
                    status: [
                        {type: 'normal', start:1532044800000, end:1532046600000 },
                        {type: 'warning', start:1532046600000, end:1532057820000 },
                        {type: 'alarm', start:1532057820000, end:1532059200000 },
                        {type: 'offline', start:1532059200000, end:1532062500000 },
                        {type: 'failure', start:1532062500000, end:1532062800000 },
                        {type: 'run', start:1532062800000, end:1532077200000 }
                    ]
                }, {
                    order: 3,
                    equipment: 'EQP34',
                    score: 0.72,
                    status: [
                        {type: 'run', start:1532044800000, end:1532051940000 },
                        {type: 'normal', start:1532051940000, end:1532052000000 },
                        {type: 'warning', start:1532052000000, end:1532061011000 },
                        {type: 'alarm', start:1532061011000, end:1532066400000 },
                        {type: 'failure', start:1532066400000, end:1532073600000 },
                        {type: 'offline', start:1532073600000, end:1532077200000 }
                    ]
                }, {
                    order: 4,
                    equipment: 'EQP34',
                    score: 0.69,
                    status: [
                        {type: 'alarm', start:1532044800000, end:1532045530500 },
                        {type: 'run', start:1532045530500, end:1532056200000 },
                        {type: 'warning', start:1532056200000, end:1532061011000 },
                        {type: 'offline', start:1532061011000, end:1532077200000 }
                    ]
                }, {
                    order: 5,
                    equipment: 'EQP34',
                    score: 0.66,
                    status: [
                        {type: 'run', start:1532044800000, end:1532051940000 },
                        {type: 'normal', start:1532051940000, end:1532052000000 },
                        {type: 'warning', start:1532052000000, end:1532061011000 },
                        {type: 'alarm', start:1532061011000, end:1532066400000 },
                        {type: 'failure', start:1532066400000, end:1532073600000 },
                        {type: 'offline', start:1532073600000, end:1532077200000 }
                    ]
                }
            ];
            console.log('err', err);
            console.log('this.listData', this.listData);
            this.hideSpinner();
        });
    }
}
