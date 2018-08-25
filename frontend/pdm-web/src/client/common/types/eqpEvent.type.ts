export interface EqpEventType {
    rawId?:number;
    eqpId:number;
    eventName:string;
    eventTypeCd:string;
    processYn:string;
    paramId:number;
    condition:string;
    eventGroup:string;
    timeIntervalYn:string;
    intervalTimeMs:number;
    timeout: number;
    createBy?:string;
    createDtts?:any;
    updateBy?:string;
    updateDtts?:any;
}