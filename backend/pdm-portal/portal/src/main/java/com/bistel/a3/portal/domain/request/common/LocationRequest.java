package com.bistel.a3.portal.domain.request.common;

/**
 * Created by yohan on 15. 11. 5.
 */
public class LocationRequest {
    private Long locationId;
    private Boolean includeChildLocation;

    public Long getLocationId() {
        return locationId;
    }

    public void setLocationId(Long locationId) {
        this.locationId = locationId;
    }

    public Boolean getIncludeChildLocation() {
        return includeChildLocation;
    }

    public void setIncludeChildLocation(Boolean includeChildLocation) {
        this.includeChildLocation = includeChildLocation;
    }
}
