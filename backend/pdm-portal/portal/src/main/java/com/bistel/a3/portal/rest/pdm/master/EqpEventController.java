package com.bistel.a3.portal.rest.pdm.master;

import com.bistel.a3.portal.domain.pdm.db.EqpEvent;
import com.bistel.a3.portal.domain.pdm.master.PartWithParam;
import com.bistel.a3.portal.service.pdm.IMasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class EqpEventController {
    @Autowired
    private IMasterService service;

    @RequestMapping("eqpEvents")
    public List<EqpEvent> getEqpEvents(@PathVariable String fabId) {
        return service.getEqpEventAll(fabId);
    }

    @RequestMapping("/eqps/{eqpId}/eqpEventsByeqpId")
    public List<EqpEvent> getEqpEventByEqpId(@PathVariable String fabId,@PathVariable Long eqpId) {
        return service.getEqpEvents(fabId,eqpId);
    }


    @RequestMapping(value = "eqpEvent", method = RequestMethod.PUT)
    public void setPart(Principal user,@PathVariable String fabId, @RequestBody EqpEvent eqpEvent) {
        if(eqpEvent.getRawId()==null){
            eqpEvent.setCreateBy(user.getName());
        }
        eqpEvent.setUpdateBy(user.getName());
        service.setEpqEvent(fabId,eqpEvent);
    }


}
