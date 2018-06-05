package com.bistel.a3.portal.domain.request.common;

import com.bistel.a3.portal.domain.data.TimePeriod;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class ProductsRequestTest extends LocationRequest {
    private TimePeriod timePeriod;

    @InjectMocks
    private ProductsRequest actual = new ProductsRequest();

    @Test
    public final void testTimePeriod() {
        TimePeriod timePeriod = new TimePeriod();
        timePeriod.setFrom(1467975600000L);
        this.timePeriod = timePeriod;
        actual.setTimePeriod(timePeriod);

        assertEquals(this.timePeriod, actual.getTimePeriod());
    }
}
