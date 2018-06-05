package com.bistel.a3.portal.domain.request.common;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.powermock.modules.junit4.PowerMockRunner;

import static org.junit.Assert.assertEquals;

@RunWith(PowerMockRunner.class)
public class LocationRequestTest {
    private Long locationId;
    private Boolean includeChildLocation;

    @InjectMocks
    LocationRequest actual = new LocationRequest();

    @Test
    public final void testLocationId() {
        Long locationId = 2615L;
        this.locationId = locationId;
        actual.setLocationId(locationId);

        assertEquals(this.locationId, actual.getLocationId());
    }

    @Test
    public final void testIncludeChildLocation() {
        Boolean includeChildLocation = true;
        this.includeChildLocation = includeChildLocation;
        actual.setIncludeChildLocation(includeChildLocation);

        assertEquals(this.includeChildLocation, actual.getIncludeChildLocation());
    }
}
