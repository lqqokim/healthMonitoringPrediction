import { Injectable } from "@angular/core";
import { PlatformModelService } from "../../../../../model/platform/platform-model.service";

@Injectable()
export class SharedUserDetailService {

    constructor(
        private platformModel: PlatformModelService
    ) {}

    getUserDetail(userId: any) {
        return this.platformModel.getUser(userId);
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
