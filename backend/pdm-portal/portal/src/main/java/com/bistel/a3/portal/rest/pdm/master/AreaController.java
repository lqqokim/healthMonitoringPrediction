package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.Area;
import com.bistel.a3.portal.service.pdm.IMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("pdm/fabs/{fabId}/areas")
public class AreaController {
    @Autowired
    private IMasterService service;

    @RequestMapping
    public Object getAreas(@PathVariable String fabId, @RequestParam(value = "parentId", defaultValue = "0") Long parentId) {
        return service.getAreas(fabId, parentId);
    }
    @RequestMapping(value = "/all")
    public Object getAreasAll(@PathVariable String fabId, @RequestParam(value = "parentId", defaultValue = "0") Long parentId) {
        return service.getAreaAll(fabId);
    }

    @RequestMapping("{areaId}")
    public Object getArea(@PathVariable String fabId, @PathVariable Long areaId) {
        return service.getArea(fabId, areaId);
    }

    @RequestMapping(method = RequestMethod.PUT)
    public void setArea(Principal user, @PathVariable String fabId, @RequestBody Area area) {
        area.setUserName(user.getName());
        service.setArea(fabId, area);
    }

    @RequestMapping(value = "{areaId}", method = RequestMethod.DELETE)
    public void removeArea(@PathVariable String fabId, @PathVariable Long areaId) {

        service.removeArea(fabId, areaId);
    }
}
