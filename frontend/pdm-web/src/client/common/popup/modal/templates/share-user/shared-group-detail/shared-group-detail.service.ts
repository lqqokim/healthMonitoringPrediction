import { Injectable } from "@angular/core";
import { PlatformModelService } from "../../../../../model/platform/platform-model.service";

@Injectable()
export class SharedGroupDetailService {

    constructor(
        private platformModel: PlatformModelService
    ) {}

    getGroupDetail(groupId: any) {
        return this.platformModel.getGroup(groupId);
    }

    getGroupUsers(groupId: any) {
        return this.platformModel.getGroupUsers(groupId);
    }

    //
    // Mock Data
    //
    private _mock(): Promise<any> {
        let result: any = [];
        result.push({
            "groupId": "group",
            "userId": "id",
            "name": "name",
            "email": "email"+".bistel.com",
            "phoneNo": null,
            "description": null,
            "department": null,
            "responsibilities": null,
            "type": 'group'
        })
        return Promise.resolve(result);
    }
}
