package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Bearing;
import com.bistel.a3.portal.service.pdm.IMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("pdm/fabs/{fabId}/bearings")
public class BearingController {
    @Autowired
    private IMasterService service;

    @RequestMapping
    public Object getBearings(@PathVariable String fabId) {
        return service.getBearings(fabId);
    }

    @RequestMapping("{modelNumber}/{manufacture}")
    public Object getBearing(@PathVariable String fabId, @PathVariable String modelNumber, @PathVariable String manufacture) {
        return service.getBearing(fabId, modelNumber, manufacture);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void setBearing(Principal user, @PathVariable String fabId, @RequestBody Bearing bearing) {
        bearing.setUserName(user.getName());
        service.setBearing(fabId, bearing);
    }

    @RequestMapping(value = "{modelNumber}/{manufacture}", method = RequestMethod.DELETE)
    public void removeBearing(@PathVariable String fabId,  @PathVariable String modelNumber, @PathVariable String manufacture) {
        service.removeBearing(fabId, modelNumber, manufacture);
    }
}
