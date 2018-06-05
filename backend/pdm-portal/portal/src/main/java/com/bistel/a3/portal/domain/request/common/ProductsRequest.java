package com.bistel.a3.portal.domain.request.common;

import com.bistel.a3.portal.domain.data.TimePeriod;

/**
 * Created by yohan on 15. 11. 5.
 */
public class ProductsRequest extends LocationRequest {
    private TimePeriod timePeriod;

    public TimePeriod getTimePeriod() {
        return timePeriod;
    }

    public void setTimePeriod(TimePeriod timePeriod) {
        this.timePeriod = timePeriod;
    }
}
