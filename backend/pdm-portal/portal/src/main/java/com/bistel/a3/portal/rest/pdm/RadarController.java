package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.common.FilterCriteriaData;
import com.bistel.a3.portal.domain.common.FilterTraceRequest;
import com.bistel.a3.portal.domain.common.HeadDatas;
import com.bistel.a3.portal.domain.pdm.EqpParamDatas;
import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.STDTraceTrx;
import com.bistel.a3.portal.service.pdm.IReportService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class RadarController {
    enum TYPE {AW, G5, B5,NW} //NW:number of worst

    @Autowired
    private IReportService reportService;

    @Autowired
    private ITraceDataService traceDataService;


    @RequestMapping("radareqps")
    public Object radarEqps(@PathVariable("fabId") String fabId, @RequestParam("type") String stringType,
                            @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate, @RequestParam("numberOfWorst") Integer numberOfWorst) {
        TYPE type = TYPE.valueOf(stringType);
        Date from = new Date(fromdate);
        Date to = new Date(todate);

        List<EqpStatusData> result = Collections.EMPTY_LIST;


        switch (type) {
            case AW:
                result = reportService.getAlarmWarningEqps(fabId, from, to);
                break;
            case G5:
                result = reportService.getGoodFiveEqps(fabId, from, to);
                break;
            case B5:
                result = reportService.getBadFiveEqps(fabId, from, to);
                break;
            case NW:
                result = reportService.getNumberOfWorstEqps(fabId, from, to,numberOfWorst);
        }
        reportService.getDuration(fabId, result, from, to);

        return result;
    }

    @RequestMapping("eqps/{eqpId}/radar")
    public Object getRadar(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId,
                        @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        Date from = new Date(fromdate);
        Date to = new Date(todate);
        return reportService.getParamClassifications(fabId, eqpId, from, to);
    }


    @RequestMapping("eqps/{eqpId}/params/{paramId}/overall")
    public Object getOverall(@PathVariable("fabId") String fabId, @PathVariable("eqpId") Long eqpId, @PathVariable("paramId") Long paramId,
                          @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate) {
        return reportService.getOverall(fabId, eqpId, paramId, fromdate, todate);
    }
//    @RequestMapping(method = RequestMethod.POST, value ="filterTraceData")
//    public Object getFilterTraceData(@PathVariable("fabId") String fabId,
//                                     @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
//                                     @RequestBody HashMap<String,Object> bodyData) {
//        List<Long> eqpIds =(List<Long>) bodyData.get("eqpIds");
//        List<String> paramNames =(List<String>) bodyData.get("paramNames");
//        return traceDataService.getFilterTraceData(fabId,eqpIds,paramNames,new Date(fromdate),new Date(todate));
//    }

    @RequestMapping(method = RequestMethod.POST, value ="filterTraceData/eqpIdsParamIds")
    public Object getEqpIdsParamIdsFilterTraceData(@PathVariable("fabId") String fabId,
                                     @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                     @RequestBody FilterTraceRequest bodyData) {
//        List<Long> eqpIds =(List<Long>) bodyData.get("eqpIds");
//        List<String> paramNames =(List<String>) bodyData.get("paramNames");
//        List<FilterCriteriaData> filterCriteriaDatas =(List<FilterCriteriaData>) bodyData.get("filterCriteriaDatas");

        return traceDataService.getEqpIdsParamIdsInFilterTraceData(fabId,bodyData.getEqpIds(),bodyData.getParamNames(),new Date(fromdate),new Date(todate), bodyData.getFilterCriteriaDatas());
    }
    @RequestMapping(method = RequestMethod.POST, value ="eqps/{eqpId}/filterTraceData")
    public List<EqpParamDatas> getFilterTraceData(@PathVariable("fabId") String fabId,
                                                  @PathVariable("eqpId") Long eqpId,
                                                  @RequestParam("eqpName") String eqpName,
                                                  @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                                  @RequestBody FilterTraceRequest bodyData) {
        return traceDataService.getFilterTraceDataByEqpIdParamIds(fabId,eqpId,eqpName,bodyData.getParamIds(),bodyData.getParamNames() ,new Date(fromdate),new Date(todate),bodyData);
    }
    @RequestMapping(method = RequestMethod.POST, value ="eqps/{eqpId}/params/{paramId}/filterTraceData")
    public List<STDTraceTrx> getFilterTraceDataByEqpIdParamId(@PathVariable("fabId") String fabId,
                                                              @PathVariable("eqpId") Long eqpId,
                                                              @PathVariable("paramId") Long paramId,
                                                              @RequestParam("fromdate") Long fromdate, @RequestParam("todate") Long todate,
                                                              @RequestBody FilterTraceRequest bodyData) {
        return traceDataService.getFilterTraceDataByEqpIdParamId(fabId,eqpId,paramId,new Date(fromdate),new Date(todate),bodyData);
    }

}
