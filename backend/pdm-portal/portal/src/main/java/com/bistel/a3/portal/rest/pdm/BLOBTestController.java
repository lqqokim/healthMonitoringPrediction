package com.bistel.a3.portal.rest.pdm;

import com.bistel.a3.portal.domain.pdm.EqpHealthIndexTrend;
import com.bistel.a3.portal.domain.pdm.EqpStatusData;
import com.bistel.a3.portal.domain.pdm.db.HealthInfo;
import com.bistel.a3.portal.service.pdm.IBLOBTest;
import com.bistel.a3.portal.service.pdm.ISummaryDataService;
import com.bistel.a3.portal.service.pdm.ITraceDataService;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("pdm/fabs/{fabId}")
public class BLOBTestController {
    @Autowired
    private IBLOBTest blobTest;

    @Autowired
    private ITraceDataService traceDataService;

    @Value("${GlobalVariationPrevious}")
    private int globalVariationPrevious;

    //Done
    @RequestMapping("BLOBTest")
    public void getAlarmCountSummary() throws ParseException {

        try {
            blobTest.blobDecompTest();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }

    }



}

