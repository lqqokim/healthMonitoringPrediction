package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import com.bistel.a3.portal.service.pdm.IMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("pdm/fabs/{fabId}/eqps/{eqpId}")
public class PartController {
    @Autowired
    private IMasterService service;

    @RequestMapping("parttypes")
    public Object getPartTypes(@PathVariable String fabId) {
        return service.getPartTypes(fabId);
    }

    @RequestMapping("speedparam")
    public Object getSpeedParam(Principal user, @PathVariable String fabId, @PathVariable Long eqpId) {
        return service.getSpeedParam(fabId, eqpId);
    }

    @RequestMapping("parts")
    public Object getParts(@PathVariable String fabId, @PathVariable Long eqpId) {
        return service.getParts(fabId, eqpId);
    }

    @RequestMapping("parts/{partId}")
    public Object getPart(@PathVariable String fabId, @PathVariable Long partId) {
        return service.getPart(fabId, partId);
    }

    @RequestMapping(value = "parts", method = RequestMethod.DELETE)
    public void removeParts(@PathVariable String fabId, @PathVariable Long eqpId, @RequestParam Long[] partIds) {
        service.removeParts(fabId, eqpId, partIds);
    }

    @RequestMapping(value = "parts", method = RequestMethod.PUT)
    public void setPart(Principal user,@PathVariable String fabId, @RequestBody PartWithParam part) {
        part.setUserName(user.getName());
        service.setPart(fabId, part);
    }

    @RequestMapping(value = "parts/{partId}", method = RequestMethod.DELETE)
    public void removePart(@PathVariable String fabId, @PathVariable Long eqpId, @PathVariable Long partId) {
        service.removePart(fabId, eqpId, partId);
    }
}
