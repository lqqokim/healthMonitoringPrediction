import { Injectable } from '@angular/core';

import { WqpModelService } from '../../../../../common';

@Injectable()
export class WqpAppConfigService {
    
    constructor(
        private wqpModelService:WqpModelService
    ) { }
    
    getProducts() {
        return this.wqpModelService.getProductsIncludeStep();
    }

    setProducts(requestBody) {
        return this.wqpModelService.setProducts(requestBody);
    }

    setProductUseYn(productId, productName, useYn) {
        let requestBody = {
            productId: productId,
            productName: productName,
            useYn: useYn
        }
        return this.wqpModelService.setProductStatus(requestBody);
    }
}