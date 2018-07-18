export interface EqpEventType {
    rawId?:number;
    eqpId:number;
    eventName:string;
    eventTypeCd:string;
    processYn:string;
    paramId:number;
    condition:string;
    createBy:string;
    createDtts:any;
    updateBy:string;
    updateDtts:any;
}